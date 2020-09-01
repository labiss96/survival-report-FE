import AsyncStorage from "@react-native-community/async-storage";
import { initWebSocket, sendMessage } from "./socket-config";
import { observable } from "mobx";

export function createAuthStore () {
  return {
    reportFlag: false,
    isLoading: true,
    userToken: null,
    userId: '',
    websocket: null,

    getUserToken: () => {
      return this.userToken;
    },
    
    retrieve: async () => {
      try {
        this.userToken = await AsyncStorage.getItem("userToken");
        this.userId = await AsyncStorage.getItem("userId");
        
      } catch (e) {
        console.log(e);
      }
    },
    signIn: async (token, id) => {
      try {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userId", String(id));
        this.userToken = token;
        this.userId = id;
        console.log(`run sign in fucntion ! >> ${this.userToken} >> ${this.userId}`);
      } catch (e) {
        console.log(e);
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userId");
        this.userToken = null;
        this.userId = '';
      } catch (e) {
        console.log(e);
      }
    },
    setReport: (boolean) => {
      console.log("set Report!");
      this.reportFlag = boolean;
    },
    setIsLoading: (boolean) => {
      this.isLoading = boolean;
    },

    initWebsocket: async (sender_id) => {
      let ws = new WebSocket(`ws://192.168.0.11:8088/ws/chat/${sender_id}`);
      ws = await initWebSocket(ws);
      this.websocket = ws;
      this.websocket.onmessage = (e) => {
        console.log('get message event !!! > ', JSON.stringify(e.data));
        //setMessages(prevState => [...prevState, e.data]);
      }
      console.log(`====== store websocket ====> ${websocket}`);
    },

    onMessage: (data) => {
      sendMessage(this.websocket, data);
    },
  }
};
