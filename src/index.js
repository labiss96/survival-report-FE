import React, {useState, useEffect, useContext } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AuthContext } from "./context";

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
	const [userToken, setUserToken] = useState(null);
	const [reportFlag, setReportFlag] = useState(false);

	useEffect(() => {
		console.log('run useEffect : Index');
	})

	const authContext = React.useMemo(() => {
		return {
			signIn: (token) => {
				console.log('run sign in!');
				setUserToken(token);
			},
			signUp: () => {
				setUserToken('token');
			},
			signOut: () => {
				setUserToken(null);
			},
			onReport: () => {
				console.log('run onReport!');
				setReportFlag(true);
			},
			getReportFlag : reportFlag
		};
	}, []);

	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				<RootStackScreen userToken={userToken} reportFlag={reportFlag}/>
			</NavigationContainer>
		</AuthContext.Provider>
	);

}