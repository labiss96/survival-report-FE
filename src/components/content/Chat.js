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

const ChatView = ({ name, description, id, navigation }) => (
  <List.Item
    title={name}
    description={description}
    left={(props) => <List.Icon {...props} icon="account" />}
    onPress={() =>
      navigation.navigate("Chat", {
        screen: "ChatDetail",
        params: {
          title: name,
          chatId: id,
          receiverId: name,
        },
      })
    }
  />
);

export const Chat = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [chatData, setChatData] = useState([]);
  useEffect(() => {
    const dummy = [
      {
        name: "이정현",
        last_message: "테스트 메시지다..",
        chat_id: "1",
      },
      {
        name: "박종민",
        last_message: "테스트 메시지야 시발",
        chat_id: "2",
      },
    ];

    setChatData(dummy);
  }, []);
  return (
    <>
      <View>
        {chatData.map((elem, idx) => (
          <ChatView
            key={idx}
            name={elem.name}
            description={elem.last_message}
            id={elem.chat_id}
            navigation={navigation}
          />
        ))}
      </View>
    </>
  );
};
