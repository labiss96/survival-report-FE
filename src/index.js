import React, { useState, useEffect, useContext, useReducer } from "react";
import { StyleSheet, Button } from "react-native";
import { IconButton, Colors } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, Assets } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons as Icon } from "react-native-vector-icons";

import AsyncStorage from "@react-native-community/async-storage";

import { AuthContext } from "./context";

import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Auth } from "./components/auth/Auth";

import { Home } from "./components/content/Home";
import { Survivor } from "./components/content/Survivor";
import { MyPage } from "./components/content/Mypage";

import { Chat } from "./components/content/Chat";
import { ChatDetail } from "./components/content/ChatDetail";

import Progress from "./components/Progress";

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
  <ChatStack.Navigator>
    <ChatStack.Screen
      name="ChatList"
      component={Chat}
      options={{
        title: "Chat List",
      }}
    />
    <ChatStack.Screen
      name="ChatDetail"
      component={ChatDetail}
      options={({ route, navigation }) => ({
        title: route.params.title,
        headerLeft: () => (
          <IconButton
            icon="keyboard-backspace"
            color={Colors.grey700}
            size={20}
            animated={true}
            onPress={() =>
              navigation.navigate("Chat", {
                screen: "ChatList",
              })
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
const TabsScreen = () => (
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
        tabBarIcon: ({ color }) => (
          <Icon name="account-circle" color={color} size={26} />
        ),
      }}
    />
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
      options={{ title: "E-mail 인증" }}
    />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken, reportFlag }) => {
  useEffect(() => {
    console.log("run useEffect : RootStack");
    console.log("userToken : ", userToken);
    console.log("report Flag : ", reportFlag);
  });
  return (
    <RootStack.Navigator headerMode="none">
      {userToken ? (
        <>
          {reportFlag ? (
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
  );
};

export default () => {
  // const [userToken, setUserToken] = useState(null);
  const [reportFlag, setReportFlag] = useState(false);
  const [websocket, setWebsocket] = useState(null);

  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => {
    return {
      signIn: async (token, userId) => {
        try {
          await AsyncStorage.setItem("userToken", token);
          await AsyncStorage.setItem("userId", String(userId));

        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", token: token});
      },

      signUp: () => {
        setUserToken("token");
      },

      signOut: async () => {
        // setUserToken(null);
        try {
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userId");
          
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },

      onReport: () => {
        console.log("run onReport!");
        setReportFlag(true);
      },
      getReportFlag: reportFlag,

      setupWebsocket : (user_id) => { setupWebsocket(user_id); },

      onMessage: (type, message, receiver_id) => {
        sendMessage(type, message, receiver_id);
      }
    };
  }, []);

  const sendMessage = (type, message, receiver_id) => {
    console.log('run send message');
    console.log(websocket);
    websocket.send(JSON.stringify({type: type, message: message, receiver_id: receiver_id}))
  }

  const setupWebsocket = (userId) => {

    let ws = new WebSocket(`ws://172.30.1.54:8080/ws/chat/${userId}`);
    
    console.log('run setup websocket');
    
    ws.onopen = () => {
      console.log('run ws open!');
      // connection opened
      //ws.send(JSON.stringify({message: 'hello this is react-native!'})); // send a message
    };

    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      let msg = data['message'];
      console.log(`message : ${msg}`);
    }
    
    
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    setWebsocket(ws);
  }

  useEffect(() => {
    console.log("run useEffect : Index");
    setReportFlag(false);
    setTimeout(async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return <Progress />;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen
          userToken={loginState.userToken}
          reportFlag={reportFlag}
        />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
