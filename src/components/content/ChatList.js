import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Keyboard
} from "react-native";

import { List } from "react-native-paper";

import { useAuthStore } from "../../store/authContext"
import { getChatList } from '../../api/chatAPI';

const useForceUpdate = () => useState()[1];

const ChatView = ({ receiverName, description, receiverId, sendDate, navigation }) => (
  <List.Item
    title={receiverName}
    description={description}
    left={(props) => <List.Icon {...props} icon="account" />}
    right={() => <Text>{String(sendDate)}</Text>}
    onPress={() =>
      navigation.navigate("Chat", {
        screen: "ChatDetail",
        params: {
          title: receiverName,
          receiverId: receiverId,
          receiverName: receiverName,
        },
      })
    }
  />
);

export const ChatList = ({ navigation }) => {
  const forceUpdate = useForceUpdate();
  const store = useAuthStore();
  const [chatData, setChatData] = useState([]);

  const getChatData = async () => {
    await getChatList(store.userId).then(result => {
      console.log('get chat data >> ', result.data.chatroom_list);
      setChatData(result.data.chatroom_list);
      forceUpdate();
    })
  }

  const renderNewChat = (message) => {
    let parseMessage = JSON.parse(message);
    console.log('this is render message[parse] :: ChatList >>', parseMessage);
    getChatData();
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getChatData();
      store.messageCallback(renderNewChat);
    });
    //const unsubscribe = 
    //return unsubscribe;
  }, [navigation]);
  
  useEffect(() => {
    Keyboard.dismiss();
  })

  return (
    <>
      <View>
        {chatData.map((elem, idx) => (
          <ChatView
            key={idx}
            receiverName={elem.receiver_name}
            receiverId={elem.receiver_id}
            description={elem.last_message}
            sendDate={elem.last_message_time}
            navigation={navigation}
          />
        ))}
      </View>
    </>
  );
};
