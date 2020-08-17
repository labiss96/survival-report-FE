import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from "./context";

import { Login } from "./components/Login";

const AuthStack = createStackNavigator();

export default () => {
    return (
    <NavigationContainer>
        <AuthStack.Navigator>
            <AuthStack.Screen name='Login' component={Login} />
        </AuthStack.Navigator>
    </NavigationContainer>
    );
    
}