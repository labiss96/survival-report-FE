import React from 'react';
import { useLocalStore, useObserver } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";

import { _URL } from "../config/severConfig";

const AuthContext = React.createContext();
// 소켓 메시지 중복응답 방지 변수
let tempMessage = {};

const isDuplicated = (obj, key, value) => {
  
  if(obj[key] !== undefined) {
    console.log(`비교하는 값 (${value}) VS 비교당하는 값 (${obj[key]})`);
    return obj[key] === value;
  } else {
    console.log(obj[key]); 
    console.log('해당 키 값은 정의되지 않았습니다');
    return false;
  }
  
}

const AuthProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    reportFlag: false,
    isLoading: true,
    userToken: null,
    userId: '',
    websocket: null,
    callback: null,
    receiverId: '',
    receiverName: '',

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
        store.reportFlag = false;
        
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

      let ws = new WebSocket(`ws://${_URL}:8088/ws/chat/${sender_id}`);
      console.log(`WS server domain : ws://${_URL}:8088/ws/chat/${sender_id}`)
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
            let userId = await AsyncStorage.getItem("userId");
            if(data.reporter !== Number(userId)) {
              if(store.callback !== null) {
                store.callback(data);
              }
            }
            
            break;
          case 'MESSAGE':
            if(isDuplicated(tempMessage, '_id', data._id)) {
              console.log('중복된 소켓 응답 메시지입니다.');
            } else {
              console.log('message_type :: MESSAGE');
              if(store.callback !== null) {
                store.callback(data);
                tempMessage = data;
              }
            }
            break;
  
          default:
            console.log('WRONG message type!');
        }
        
        
      }

      store.websocket = ws;
    },

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
    },

    setReceiver: (id, name) => {
      store.receiverId = id;
      store.receiverName = name;
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