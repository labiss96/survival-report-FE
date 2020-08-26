import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { TextInput, Button } from "react-native-paper";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { AuthContext } from "../../context";

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
  const { onMessage } = React.useContext(AuthContext);

  const handlingSend = () => {
    onMessage("INITIAL", "Hello", 3);
  }

  //useEffect(() => {
  //}, []);

  return (
    <ScreenContainer>
      <View>
        <Text>Chat Detail Screen! :: {receiverId}</Text>
        <Button onPress={() => handlingSend()}>Fuck</Button>
      </View>
      
    </ScreenContainer>
  );
};
