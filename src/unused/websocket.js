//import { SOCKET_URL } from "./settings";

class WebSocketService {
  static instance = null;
  callback = null;

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(senderID) {
    //const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`;
    const path = `ws://172.30.1.38:8088/ws/chat/${senderID}/`;
    this.socketRef = new WebSocket(path);

    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    if (this.callback === null) {
      return;
    }

    this.callback(parsedData);
  }

  //fetchMessages(username, chatId) {
  //  this.sendMessage({
  //    command: "fetch_messages",
  //    username: username,
  //    chatId: chatId
  //  });
  //}

  //newChatMessage(message) {
  //  this.sendMessage({
  //    command: "new_message",
  //    from: message.from,
  //    message: message.content,
  //    chatId: message.chatId
  //  });
  //}

  setCallback(messagesCallback) {
    this.callback = messagesCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
