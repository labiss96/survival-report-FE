import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Keyboard
} from "react-native";

import { List } from "react-native-paper";

import { useAuthStore } from "../../store/authContext"
import { getChatList } from '../../api/chatAPI';

const ChatView = ({ receiverName, description, receiverId, sendDate, navigation }) => {
  const store = useAuthStore();
  return (
    <List.Item
      title={receiverName}
      description={description}
      left={(props) => <List.Icon {...props} icon="account" />}
      right={() => <Text>{String(sendDate)}</Text>}
      onPress={() => {
        store.setReceiver(receiverId, receiverName);
        return (
          navigation.navigate("Chat", {
            screen: "ChatDetail",
            params: {
              title: receiverName,
            },
          })
        );
      }
        
      }
    />);
}

export const ChatList = ({ navigation }) => {
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
    console.log('ChatList :: onmessage callback >>', message);
    getChatData();
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getChatData();
      console.log('focus ChatList!');
      store.setCallback(renderNewChat);
    });
  
    return unsubscribe;
  }, [navigation]);

  //useEffect(() => {
  //  navigation.addListener('focus', () => {
  //    getChatData();
  //    console.log('chat list 콜백 등록됬어?');
  //    store.setCallback(renderNewChat);
  //  });
  //  //const unsubscribe = 
  //  //return unsubscribe;
  //}, [navigation]);
  
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
