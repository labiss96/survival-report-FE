import React, { useState, useEffect, useContext, useReducer } from "react";
import { StyleSheet, Button } from "react-native";
import { IconButton, Colors } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, Assets } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons as Icon } from "react-native-vector-icons";

import { checkValidation } from "./api/authAPI";

import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { AuthMail } from "./components/auth/AuthMail";

import { Home } from "./components/content/Home";
import { Survivor } from "./components/content/Survivor";
import { MyPage } from "./components/content/Mypage";

import { ChatList } from "./components/content/ChatList";
import { ChatDetail } from "./components/content/ChatDetail";

import Progress from "./components/Progress";
import { useAuthStore } from "./store/authContext";
import { useObserver } from "mobx-react";


const SurvivorStack = createStackNavigator();
const SurvivorStackScreen = () => (
  <SurvivorStack.Navigator>
    <SurvivorStack.Screen
      name="SurvivorList"
      component={Survivor}
      options={{
        title: "Survivor List",
      }}
    />
  </SurvivorStack.Navigator>
);

const ChatStack = createStackNavigator();
const ChatStackScreen = () => (
  <ChatStack.Navigator
    initialRouteName="ChatList">
    <ChatStack.Screen
      name="ChatList"
      component={ChatList}
      options={{
        title: "Chat List",
        headerLeft: null
      }}
    />
    <ChatStack.Screen
      name="ChatDetail"
      component={ChatDetail}
      options={({ route, navigation }) => ({
        title: route.params.receiverName,
        headerLeft: () => (
          <IconButton
            icon="keyboard-backspace"
            color={Colors.grey700}
            size={20}
            animated={true}
            onPress={() => {
                navigation.navigate("Chat", {
                  screen: "ChatList",
                });
              }
            }
          />
        ),
        headerRight: () => (
          <IconButton
            icon="exit-to-app"
            color={Colors.red500}
            size={20}
            animated={true}
            onPress={() => alert("exit chatting room!")}
          />
        ),
      })}
    />
  </ChatStack.Navigator>
);

const Tabs = createMaterialBottomTabNavigator();
const TabsScreen = () => {
  const store = useAuthStore();

  return (
  <Tabs.Navigator
    initialRouteName="Survivor"
    activeColor="#f0edf6"
    inactiveColor="#3e2465"
    barStyle={{ backgroundColor: "#46c3ad" }}
  >
    <Tabs.Screen
      name="Survivor"
      component={SurvivorStackScreen}
      options={{
        title: "Survivor List",
        tabBarLabel: "Survivors",
        tabBarIcon: ({ color }) => <Icon name="hail" color={color} size={26} />,
      }}
    />
    <Tabs.Screen
      name="Chat"
      component={ChatStackScreen}
      options={{
        tabBarLabel: "Chat",
        tabBarIcon: ({ color }) => <Icon name="chat" color={color} size={26} />,
      }}
    />
    <Tabs.Screen
      name="MyPage"
      component={MyPage}
      options={{
        title: "My Page",
        tabBarLabel: "My Page",
        tabBarIcon: ({ color }) => <Icon name="account-circle" color={color} size={26} />,
      }}
    />
  </Tabs.Navigator>
);
}

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
      component={AuthMail}
      options={{ title: "E-mail 인증" }}
    />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = () => {

  const store = useAuthStore();

  useEffect(() => {
    console.log(`run useEffect : RootStack \n -userToken : [${store.userToken}] \n -report Flag : ${store.reportFlag}`);
  }, [store]);
  
  return useObserver(() => (
    <RootStack.Navigator headerMode="none">
      {store.userToken !== null ? (
        <>
          {store.reportFlag ? (
            <RootStack.Screen
              name="Tabs"
              component={TabsScreen}
              options={{ animationEnabled: false }}
            />
          ) : (
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
            animationEnabled: false,
          }}
          path="auth"
        />
      )}
    </RootStack.Navigator>
  ));
};


export default () => {

  const { setIsLoading, setReport, retrieve, initWebsocket, signOut, userToken} = useAuthStore();

  const reconnectSocket = async () => {
    await checkValidation().then(result => {
      initWebsocket(result.data.user.id);
    }).catch(err => {
      console.log(err);
      signOut();
    })
  }

  const initAuth = async () => {
    await retrieve();
    
    reconnectSocket();
    
  }

  useEffect(() => {
    setReport(false);
    initAuth();

    setTimeout(() => {
      
      //setIsLoading(true);
    }, 1000);
  }, []);

  return useObserver(() => (
    <NavigationContainer>
      <RootStackScreen/>
    </NavigationContainer>
  ));
};
