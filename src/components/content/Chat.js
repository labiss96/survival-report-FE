import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";

import { List } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../context";
import { getChatList } from '../../api/chatAPI';
import AsyncStorage from "@react-native-community/async-storage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

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
          title: name,
          receiverId: receiverId,
          receiverName: receiverName,
        },
      })
    }
  />
);

export const Chat = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [chatData, setChatData] = useState([]);

  const getChatData = async () => {
    let userId = await AsyncStorage.getItem("userId");
    await getChatList(userId).then(result => {
      console.log('get chat data >> ', result.data.chatroom_list);
      setChatData(result.data.chatroom_list);
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getChatData();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


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
