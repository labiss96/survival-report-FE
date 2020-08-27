import React from 'react';
import { useLocalStore, useObserver } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";
import { initWebSocket, sendMessage } from "../api/socket-config";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    reportFlag: false,
    isLoading: true,
    userToken: null,
    userId: '',
    websocket: null,

    retrieve: async () => {
      try {
        store.userToken = await AsyncStorage.getItem("userToken");
        store.userId = await AsyncStorage.getItem("userId");
      } catch (e) {
        console.log(e);
      }
    },
    signIn: async (token, id) => {
      try {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userId", String(id));
        store.userToken = token;
        store.userId = id;
        console.log(`run sign in fucntion ! >> ${store.userToken} >> ${store.userId}`);
      } catch (e) {
        console.log(e);
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userId");
        store.userToken = null;
        store.userId = '';
      } catch (e) {
        console.log(e);
      }
    },
    setReport: (boolean) => {
      console.log("set Report!");
      store.reportFlag = boolean;
    },
    setIsLoading: (boolean) => {
      store.isLoading = boolean;
    },

    initWebsocket: (sender_id) => {
      store.websocket = new WebSocket(`ws://172.30.1.21/ws/chat/${sender_id}`);
      
      store.websocket.onopen = () => {
        // connection opened
        console.log('open websocket!');
        //websocket.send('something'); // send a message
      };
  
      store.websocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        console.log(`message data : ${JSON.stringify(data)}`);
      }
      
      
      store.websocket.onerror = (e) => {
        // an error occurred
        console.log(e.message);
      };
      
      store.websocket.onclose = (e) => {
        // connection closed
        console.log(e.code, e.reason);
      };

      store.websocket.onmessage = (e) => {
        console.log('get message event !!! > ', JSON.stringify(e.data));
        //setMessages(prevState => [...prevState, e.data]);
      }
      console.log(`====== store websocket ====> ${store.websocket}`);
    },

    messageCallback: (callback) => {
      store.websocket.onmessage = (e) => {
        callback(e.data);
      }
    },

    sendMessage: (data) => {
      console.log(`run send message > ${JSON.stringify(data)}`);
      store.websocket.send(JSON.stringify(data));
    },
  }));

  return (
    <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
  );
};

const useAuthStore = () => React.useContext(AuthContext);

export {AuthProvider, useAuthStore}