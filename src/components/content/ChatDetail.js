import React, { useEffect, useState, useCallback } from "react";

import AsyncStorage from "@react-native-community/async-storage";
import { GiftedChat } from 'react-native-gifted-chat';
import { getChatLog } from '../../api/chatAPI';
import { AuthContext } from "../../context";
import { Avatar } from 'react-native-paper';

export const ChatDetail = ({ route, navigation }) => {
  const { receiverName, receiverId } = route.params;
  const { onMessage, messageList, getUserId } = React.useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  let sendType = '';
  let roomId = '';
  

  const initChat = async () => {
    console.log('this is userID:', getUserId());
    await getChatLog(getUserId(), receiverId).then(result => {
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

  useEffect(() => {
    navigation.addListener('focus', () => {
      initChat();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    //return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('run useEffect::MessageList : ', messageList);
    if(messageList !== []) {
      setMessages((prevState) => [...prevState, messageList]);
    }
  }, [messageList])

  const onSend = useCallback((messages = []) => {
    let message = messages[0].text;
    //console.log(messages[0]);
    sendSocket(message);

    //가공

    //setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])
 
  const sendSocket = (message) => {
    let json_message = {};

    switch(sendType) {
      case 'INITIAL':
        json_message = {
          type: sendType,
          message: message,
          receiver_id: receiverId,
          sender_id: getUserId()
        }
        break;
      case 'MESSAGE':
        json_message = {
          type: sendType,
          message: message,
          room_id: roomId,
          receiver_id: receiverId,
        }
        break;
      default:
        console.log('샌드타입이 뭔가 잘못됬어 시발');
    }
    
    console.log('메시지 보내기 전 데이터 검사하자 : ', json_message);
    onMessage(json_message);
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{_id: Number(getUserId())}}
      renderAvatar={() => {
        <Avatar.Icon size={40} icon="account" />
      }}
      />
  );
};
