import React, { useEffect, useState, useCallback } from "react";

import { GiftedChat } from 'react-native-gifted-chat';
import { getChatLog } from '../../api/chatAPI';
import { useAuthStore } from "../../store/authContext"
import { Avatar } from 'react-native-paper';

export const ChatDetail = ({ route, navigation }) => {
  const { receiverName, receiverId } = route.params;
  const store = useAuthStore();
  
  const [messages, setMessages] = useState([]);
  

  const initChat = async () => {
    console.log('this is userID:', store.userId);
    await getChatLog(store.userId, receiverId).then(result => {
      //console.log('get chatting log data >> ', result.data);
      setMessages(result.data.messages)
    })
  }

  //화면 포커스 이벤트처리 메서드
  useEffect(() => {
    navigation.addListener('focus', () => {
      initChat();
    });
  }, [navigation]);

  const onSend = useCallback((messages = []) => {
    let message = messages[0].text;
    console.log(messages[0]);
    sendSocket(message);

    //가공

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])
 
  const sendSocket = (message) => {
    let  json_message = {
      type: 'INITIAL',
      message: message,
      receiver_id: receiverId
    }
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
