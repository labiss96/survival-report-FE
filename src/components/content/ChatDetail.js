import React, { useEffect, useState, useCallback } from "react";

import { GiftedChat } from 'react-native-gifted-chat';
import { getChatLog } from '../../api/chatAPI';
import { useAuthStore } from "../../store/authContext"
import { Avatar } from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";

export const ChatDetail = ({ route, navigation }) => {
  const { receiverName, receiverId } = route.params;
  const store = useAuthStore();
  
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let sendType = '';
  let roomId = '';

  const initChat = async () => {
    console.log('this is userID:', store.userId);
    //setIsLoading()
    await getChatLog(store.userId, receiverId).then(result => {
      console.log('get chatting log data >> ', result.data);

      if(result.data.messages.length !== 0) {
        sendType = 'MESSAGE';
        roomId = result.data.messages[0].room_id;
      } else {
        sendType = 'INITIAL';
      }
    
      setMessages(result.data.messages);
    })
  }

  const renderNewMessage = async (message) => {

    console.log('ChatDetail :: onmessage callback >>', message);
    
    sendType = 'MESSAGE';
    roomId = message.room_id;

    if(message.relogin !== null) {
      await AsyncStorage.setItem("relogin", String(message.relogin));
    } else {
      setMessages(previousMessages => GiftedChat.append(previousMessages, message))  
    }
  }

  //화면 포커스 이벤트처리 메서드
  useEffect(() => {
    navigation.addListener('focus', () => {
      initChat();
      store.setCallback(renderNewMessage);
    });
  }, [navigation]);


  const onSend = useCallback((messages = []) => {
    let message = messages[0].text;
    sendSocket(message);
  }, [])
 
  const sendSocket = async (message) => {
    let json_message = {};
    

    switch(sendType) {
      case 'INITIAL':
        json_message = {
          type: sendType,
          message: message,
          receiver_id: receiverId,
          sender_id: store.userId
        }
        break;
      case 'MESSAGE':
        let reloginFlag = null;
        try {
          reloginFlag = await AsyncStorage.getItem("relogin") === "true" ? true : false;
        } catch (e) {
          console.log(e);
        }
        
        json_message = {
          relogin: reloginFlag,
          type: sendType,
          message: message,
          room_id: roomId,
          receiver_id: receiverId,
        }
        break;
      default:
        console.log('wrong send type!');
    }

    console.log('메시지 보내기 전 데이터 검사하자 : ', json_message);
    store.sendMessage(json_message);

  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{_id: Number(store.userId)}}
      renderAvatar={() => {
        <Avatar.Icon size={40} icon="account" />
      }}
      />
  );
};
