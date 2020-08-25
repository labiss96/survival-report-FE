const initWebSocket = () => {
  try {
    let chatSocket = new WebSocket("ws://192.168.0.12:8080/ws/chat/3/connect");
    // console.log(chatSocket);
    // chatSocket.send(JSON.stringify({ message: "잘갑니까아아아아아????" }));
  } catch (err) {
    console.log(err);
  }
};

export { initWebSocket };
