import React, {useState, useEffect, useContext, useReducer } from "react";
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from "./context";

import { onLogin } from './api/authAPI';

import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Auth } from './components/auth/Auth';

import { Home } from './components/content/Home';
import { Survivor } from './components/content/Survivor';

import { Chat } from './components/Chat';


const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
	<Tabs.Navigator>
		<Tabs.Screen name="Chat" component={Chat} />
		<Tabs.Screen name="Survivor" component={Survivor} />
	</Tabs.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
	<AuthStack.Navigator>
		<AuthStack.Screen
			name="Login"
			component={Login}
			options={{ title: "Login" }}
		/>
		<AuthStack.Screen
			name="Register"
			component={Register}
			options={{ title: "Register" }}
		/>
		<AuthStack.Screen
			name="Auth"
			component={Auth}
			options={{ title: "E-mail Auth" }}
		/>
	</AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken, reportFlag }) => {
	useEffect(() => {
		console.log('run useEffect : RootStack');
		console.log( 'userToken : ',userToken);
		console.log( 'report Flag : ', reportFlag);
	})
	return (
	<RootStack.Navigator headerMode="none">
		{userToken ? (
			<>
				{
				reportFlag ? (
					<RootStack.Screen
					name="Tabs"
					component={TabsScreen}
					options={{ animationEnabled: false }}
					/>
				):(
					<RootStack.Screen
					name="Home"
					component={Home}
					options={{ title: "Report" }}
					/>
				)}
			</>
		) : (
			<RootStack.Screen
				name="Auth"
				component={AuthStackScreen}
				options={{
					animationEnabled: false
				}}
			/>
		)}
	</RootStack.Navigator>
);}

export default () => {
	// const [userToken, setUserToken] = useState(null);
	const [reportFlag, setReportFlag] = useState(false);

	const initialLoginState = {
		isLoading: true,
		email: null,
		userToken: null,
	};

	const loginReducer = (prevState, action) => {
		switch( action.type ) {
			case 'RETRIEVE_TOKEN':
				return {
					... prevState,
					userToken: action.token,
					isLoading: false,
				};
			case 'LOGIN':
				return {
					... prevState,
					email: action.email,
					userToken: action.token,
					isLoading: false,
				}
			case 'LOGOUT':
				return {
					... prevState,
					email: null,
					userToken: null,
					isLoading: false,
				}
			case 'REGISTER':
				return {
					... prevState,
					email: action.email,
					userToken: action.token,
					isLoading: false,
				}
		}
	}
	const [ loginState, dispatch ] = useReducer(loginReducer, initialLoginState);

	const authContext = React.useMemo(() => {
		return {
			signIn: async (email, password) => {

				//API 통신
        await onLogin({
          email : email,
          password: password
        }).then( async (result) => {
            console.log(result);
            alert('환영합니다!');
            try {
              await AsyncStorage.setItem('userToken', result.data.key);
            } catch(e) {
              console.log(e);
            }
            dispatch({ type: 'LOGIN', email: email, token: result.data.key });
        })
        .catch(err => {
            console.log(err);
            alert('아이디 또는 비밀번호가 틀립니다!');
        });
			},
			signUp: () => {
				setUserToken('token');
			},
			signOut: async () => {
        // setUserToken(null);
        try {
          await AsyncStorage.removeItem('userToken');
        } catch(e) {
          console.log(e);
        }

				dispatch({ type: 'LOGOUT' });
			},
			onReport: () => {
				console.log('run onReport!');
				setReportFlag(true);
			},
			getReportFlag : reportFlag
		};
	}, []);

	useEffect(() => {
		console.log('run useEffect : Index');
		setTimeout( async () => {
      let userToken = null;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        console.log(`스토리지에 저장된 유저토큰 : ${userToken}`);
      } catch(e) {
        console.log(e);
      }

			dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
		}, 1000)
  }, []);
  

	if( loginState.isLoading ) {
		return (
			<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				<ActivityIndicator size="large"/>
			</View>
		);
	}
	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				<RootStackScreen userToken={loginState.userToken} reportFlag={reportFlag}/>
			</NavigationContainer>
		</AuthContext.Provider>
	);

}