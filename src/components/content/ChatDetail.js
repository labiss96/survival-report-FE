import React, { useEffect, useState, useCallback } from "react";

import { GiftedChat } from 'react-native-gifted-chat';

import { AuthContext } from "../../context";
import { sendMessage } from "../../api/socket-config";

export const ChatDetail = ({ route, navigation }) => {
  const { receiverName } = route.params;
  const { onMessage } = React.useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `안녕 내 이름은 ${receiverName}이야 시발`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: receiverName,
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [receiverName]);

  const onSend = useCallback((messages = []) => {
    let message = messages[0].text;
    sendSocket(message);

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  const sendSocket = (message) => {
    let  json_message = {
      type: 'INITIAL',
      message: message,
      receiver_id: 3
    }
    onMessage(json_message);
  }

  return (
    //<ScreenContainer>
    //  <View>
    //    <Text>Chat Detail Screen! :: {receiverId}</Text>
    //    <Button onPress={() => handlingSend()}>Fuck</Button>
    //  </View>
      
    //</ScreenContainer>
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{_id: 1}}
      />
  );
};
