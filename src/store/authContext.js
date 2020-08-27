import React from 'react';
import { useLocalStore, useObserver } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";

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

    initWebsocket: async (sender_id) => {
      console.log('============================이건 호출 되냐???', sender_id);

      let ws = new WebSocket(`ws://172.30.1.21:8088/ws/chat/${sender_id}`);
      ws = await setupWebsocket(ws);

      console.log('init 소켓 잘 끝???', ws);

      store.websocket = ws;
    },

    messageCallback: (callback) => {
      store.websocket.onmessage = (e) => {
        console.log('websocket onmessage event! > ', e.data);
        if(callback !== null) {
          callback(e.data);
        }
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

const setupWebsocket = (ws) => {
  console.log("wswswswswsws >>",ws);
  
  try{

    ws.onopen = () => {
      // connection opened
      console.log('open websocket!');
      //websocket.send('something'); // send a message
    };
  
    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log(`message data : ${JSON.stringify(data)}`);
    }
    
    
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
      console.log('websocket ERROR >> ', JSON.stringify(e));
    };
    
    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  
    //ws.onmessage = (e) => {
    //  console.log('get message event !!! > ', JSON.stringify(e.data));
    //  //setMessages(prevState => [...prevState, e.data]);
    //}
    console.log('setup 함수 잘 끝??', ws);
    return ws;
  } catch (e) {
    console.log('error !!!', e);
  }  
  
}

const useAuthStore = () => React.useContext(AuthContext);

export {AuthProvider, useAuthStore}