
const initWebSocket = (websocket) => {
  try {
    //if(!checkNull(websocket)) {
    //  websocket = new WebSocket(`ws://172.30.1.36:8080/ws/chat/${user_id}`);
    //}

    if(checkNull(websocket)) {
      websocket.onopen = () => {
        // connection opened
        console.log('open websocket!');
        //websocket.send('something'); // send a message
      };
  
      websocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        console.log(`message data : ${JSON.stringify(data)}`);
      }
      
      
      websocket.onerror = (e) => {
        // an error occurred
        console.log(e.message);
      };
      
      websocket.onclose = (e) => {
        // connection closed
        console.log(e.code, e.reason);
      };
  
      //chatSocket.onclose = function(e) {
      //  console.error('Chat socket closed unexpectedly');
      //};
      return websocket;
    }
  } catch (err) {
    console.log(err);
  }
};

const sendMessage = (websocket, data) => {
  if(checkNull(websocket)) {
    websocket.send(JSON.stringify(data));
    console.log(`run send message > ${JSON.stringify(data)}`);
  }
}

const checkNull = (obj) => {
  if(obj === null) {
    console.log('this obj is null!');
    return false;
  } else {
    return true;
  }
}


export { initWebSocket, sendMessage };
