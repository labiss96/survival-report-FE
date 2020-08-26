import React, { useEffect, useState, useCallback } from "react";

import { GiftedChat } from 'react-native-gifted-chat';

import { AuthContext } from "../../context";
import {Avatar} from 'react-native-paper';

export const ChatDetail = ({ route, navigation }) => {
  const { receiverName, receiverId } = route.params;
  const { onMessage, messageList } = React.useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  //useEffect(() => {
  //  setMessages([
  //    {
  //      _id: 4324324,
  //      text: `씨발련아`,
  //      createdAt: new Date('2020-08-26'),
  //      user: {
  //        _id: 2,
  //      },
  //    },
  //    {
  //      _id: 1,
  //      text: `안녕 내 이름은 ${receiverName}이야 시발`,
  //      createdAt: new Date('2020-08-25'),
  //      user: {
  //        _id: 2,
  //      },
  //    },
      
  //  ])
  //}, [receiverName]);

  useEffect(() => {
    console.log('run useEffect::MessageList');
    console.log(messageList);
    setMessages(messageList);
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
      user={{_id: 1}}
      renderAvatar={(props) => {
        //<Avatar.Icon size={40} icon="weather-sunset-up" />
          return(
            <Avatar.Icon size={40} icon="account" />
            
          );
        
      }}
      //avatar={'https://placeimg.com/140/140/any'}
      />
  );
};
