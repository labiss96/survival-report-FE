import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AuthContext } from "./context";

import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen name="Home" component={Home} />
		<Tabs.Screen name="Chat" component={Chat} />
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
const RootStackScreen = ({ userToken }) => (
	<RootStack.Navigator headerMode="none">
		{userToken ? (
			<RootStack.Screen
				name="App"
				component={TabsScreen}
				options={{
					animationEnabled: false
				}}
			/>
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
);

export default () => {
	const [userToken, setUserToken] = React.useState(null);

	const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setUserToken("asdf");
      },
      signUp: () => {
        setUserToken("asdf");
      },
      signOut: () => {
        setUserToken(null);
      }
    };
  }, []);
	
	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				<RootStackScreen userToken={userToken} />
			</NavigationContainer>
		</AuthContext.Provider>
	);

}