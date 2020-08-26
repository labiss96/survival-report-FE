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
  

  const initChat = async () => {
    console.log('this is userID:', getUserId());
    await getChatLog(getUserId(), receiverId).then(result => {
      //console.log('get chatting log data >> ', result.data);
      setMessages(result.data.messages)
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
    console.log('run useEffect::MessageList');
    console.log(messageList);
    //setMessages(messageList);
  }, [messageList])

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
