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

import Progress from './components/Progress';

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
        path='auth'
			/>
		)}
	</RootStack.Navigator>
);}

export default () => {
	// const [userToken, setUserToken] = useState(null);
	const [reportFlag, setReportFlag] = useState(false);

	const initialLoginState = {
		isLoading: true,
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
          userToken: action.token,
					isLoading: false,
				}
			case 'LOGOUT':
				return {
					... prevState,
          userToken: null,
					isLoading: false,
				}
		}
	}
  const [ loginState, dispatch ] = useReducer(loginReducer, initialLoginState);

	const authContext = React.useMemo(() => {
		return {
			signIn: async (token) => {
				try {
          await AsyncStorage.setItem('userToken', token);
        } catch(e) {
          console.log(e);
        }
        dispatch({ type: 'LOGIN', token: token });
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
      } catch(e) {
        console.log(e);
      }

			dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
		}, 1000)
  }, []);
  

	if( loginState.isLoading ) {
		return (
			<Progress />
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