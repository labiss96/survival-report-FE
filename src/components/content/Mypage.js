import React, { useState, useEffect } from "react";
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
import { ScreenContainer } from "../common/ScreenContainer";
import { checkValidation } from "../../api/authAPI";
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

export const MyPage = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});

  const getUserInfo = async () => {
    await checkValidation()
      .then((result) => {
        console.log("user data : ", result.data.user);
        setUserInfo(result.data.user);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <ScreenContainer>
      <View>
        <Text>My Page</Text>
        <Text>-------------------------------------------</Text>
        <Text>USN :: {userInfo.id}</Text>
        <Text>이름 :: {userInfo.name}</Text>
        <Text>E-mail :: {userInfo.email}</Text>
        <Text>소개글 :: {userInfo.description}</Text>
      </View>
    </ScreenContainer>
  );
};
