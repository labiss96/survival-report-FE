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
    callback: null,

    retrieve: async () => {
      try {
        store.userToken = await AsyncStorage.getItem("userToken");
        store.userId = await AsyncStorage.getItem("userId");
        store.callback = null;
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
      console.log('run signout!');
      try {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userId");
        store.userToken = null;
        store.userId = '';
        store.callback = null;
        
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

    setCallback: (callback) => {
      console.log('callback 등록!');
      store.callback = callback;
    },

    initWebsocket: async (sender_id) => {

      let ws = new WebSocket(`ws://192.168.0.14:8088/ws/chat/${sender_id}`);
      ws = await setupWebsocket(ws);
      console.log('init websocket', ws);

      ws.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        console.log('onmessage event trigger >>', data);
  
        switch(data.message_type) {
          case 'SYSTEM':
            console.log('message_type :: SYSTEM');
            if(data.relogin === true) {
              console.log('재 로그인 입니다!');
              try {
                await AsyncStorage.setItem("relogin", String(data.relogin));
              } catch (err){
                console.log('relogin flag 저장 에러', err);
              }
            }
            break;
          case 'REPORT':
            console.log('message_type :: REPORT');
            console.log('누가 신고한거야 >>', data.reporter);
            let userId = await AsyncStorage.getItem("userId");
            console.log('가져온 user ID :', userId);
            if(data.reporter !== Number(userId)) {
              if(store.callback !== null) {
                store.callback(data);
              }
            }
            
            break;
          case 'MESSAGE':
            console.log('message_type :: MESSAGE');
            if(store.callback !== null) {
              store.callback(data);
            }
            break;
  
          default:
            console.log('WRONG message type!');
        }
        
      }

      store.websocket = ws;
    },

    //messageCallback: (callback) => {
    //  store.websocket.onmessage = (e) => {
    //    console.log('websocket onmessage event! > ', e.data);
        
    //    let data = JSON.parse(e.data);
      
    //    if(data.relogin === true) {
    //      console.log('재 로그인 입니다!');
    //      try {
    //        await AsyncStorage.setItem("relogin", String(data.relogin));
    //      } catch (err){
    //        console.log('relogin flag 저장 에러', err);
    //      }
    //    }

    //    if(callback !== null) {
    //      store.wsCallback(e.data);
    //    }
    //  }
    //},

    sendMessage: (data) => {
      let jsonData = JSON.stringify(data);
      console.log(`run send message > ${jsonData}`);

      store.websocket.send(jsonData);
    },

    socketReport: () => {
      console.log('run socket report');
      let reportMsg = {
        type: "REPORT"
      }
      try {
        store.websocket.send(JSON.stringify(reportMsg));
        store.setReport(true);
      } catch(e) {
        console.log('send report error >>', e)
      }
    }
  }));

  return (
    <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
  );
};

const useAuthStore = () => React.useContext(AuthContext);

const setupWebsocket = (ws) => {

  try {
    ws.onopen = () => {
      console.log('open websocket!');
    };
  
    //ws.onmessage = async (e) => {
    //  let data = JSON.parse(e.data);
    //  console.log('onmessage event trigger >>', data);

    //  switch(data.message_type) {
    //    case 'SYSTEM':
    //      console.log('message_type :: SYSTEM');
    //      if(data.relogin === true) {
    //        console.log('재 로그인 입니다!');
    //        try {
    //          await AsyncStorage.setItem("relogin", String(data.relogin));
    //        } catch (err){
    //          console.log('relogin flag 저장 에러', err);
    //        }
    //      }
    //      break;
    //    case 'REPORT':
    //      console.log('message_type :: REPORT');
    //      console.log('누가 신고한거야 >>', data.reporter);
    //      let userId = await AsyncStorage.getItem("userId");
    //      console.log('가져온 user ID :', userId);
    //      if(data.reporter !== Number(userId)) {
    //        callback(data);
    //      }
          
    //      break;
    //    case 'MESSAGE':
    //      console.log('message_type :: MESSAGE');
    //      //if(callback !== null) {
    //      //  return;
    //      //}
    //      callback(data);
    //      break;

    //    default:
    //      console.log('WRONG message type!');
    //  }
      
    //}
    
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
      console.log('websocket ERROR >> ', JSON.stringify(e));
    };
    
    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
    return ws;
  } catch (e) {
    console.log('error !!!', e);
  }  
  
}



export {AuthProvider, useAuthStore}