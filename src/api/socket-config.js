const initWebSocket = () => {
  try {
    let ws = new WebSocket("ws://172.30.1.36:8080/ws/chat/3/connect");

    ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
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
    
    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };

    ws.send(JSON.stringify({ message: "잘갑니까아아아아아????" }));

    //chatSocket.onclose = function(e) {
    //  console.error('Chat socket closed unexpectedly');
    //};
    

  } catch (err) {
    console.log(err);
  }
};

export { initWebSocket };
