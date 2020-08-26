let webSocket = null;

const initWebSocket = (user_id) => {
  try {
    if(webSocket === null) {
      webSocket = new WebSocket(`ws://172.30.1.36:8080/ws/chat/${user_id}`);
    } else {
      console.log('websocket object is exist');
    }

    webSocket.onopen = () => {
      // connection opened
      console.log('open websocket!');
      //webSocket.send('something'); // send a message
    };

    webSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log(`message data : ${JSON.stringify(data)}`);
    }
    
    
    webSocket.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };
    
    webSocket.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };

    //chatSocket.onclose = function(e) {
    //  console.error('Chat socket closed unexpectedly');
    //};

  } catch (err) {
    console.log(err);
  }
};

const sendMessage = (data) => {
  webSocket.send(JSON.stringify(data));
  console.log(`run send message > ${JSON.stringify(data)}`);
}

export { initWebSocket, sendMessage };
