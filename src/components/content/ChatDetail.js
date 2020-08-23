import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { IconButton, Colors } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: wp("3%"),
    paddingRight: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const ChatDetail = ({ route, navigation }) => {
  const { receiverId } = route.params;
  useEffect(() => {
    // navigation.setOptions({
    //   headerLeft: () => (
    //     <IconButton
    //       icon="keyboard-backspace"
    //       color={Colors.grey700}
    //       size={20}
    //       animated={true}
    //       onPress={() =>
    //         navigation.navigate("Chat", {
    //           screen: "ChatList",
    //         })
    //       }
    //     />
    //   ),
    // });
  }, []);
  return (
    <ScreenContainer>
      <View>
        <Text>Chat Detail Screen! :: {receiverId}</Text>
      </View>
    </ScreenContainer>
  );
};
