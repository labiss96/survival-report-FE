import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { onLogin } from "../../api/authAPI";
//import { AuthContext } from "../../context";
//import { initWebSocket } from "../../api/socket-config";

import { useAuthStore } from "../../store/authContext";
import { useObserver } from "mobx-react";

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Login = ({ navigation }) => {
  const store = useAuthStore();

  const [email, setEmail] = useState("cxz9080@likelion.org");
  const [password, setPassword] = useState("cakecake");

  const handlingLogin = async () => {
    console.log(`email : ${email}`);
    console.log(`pw : ${password}`);

    //API 통신
    await onLogin({
      email: email,
      password: password,
    })
      .then(async (result) => {
        console.log(`successfully logined`, result);

        await store.signIn(result.data.token, result.data.userId);
        await store.initWebsocket(result.data.userId);

        console.log('[Login.js]저장된 유저토큰 : ', store.userToken); 
      })
      .catch((err) => {
        if (err.response) {
          console.log("response err");
          switch (err.response.status) {
            case 400:
              alert(err.response.data.message);
              break;
            case 401:
              alert(err.response.data.message);
              navigation.push("Auth", { email: email });
              break;
            case 402:
              alert(err.response.data.message);
              break;
            case 403:
              alert(err.response.data.message);
              break;
            default:
              alert(err.response.data);
              break;
          }
        } else if (err.request) {
          console.log("request");
          console.log(err.request);
        } else {
          console.log(err);
        }
        console.log(error.config);
      });
  };

  return (
    <ScreenContainer>
      <View style={styles.titleArea}>
        <Text style={styles.title}>Suvival Report</Text>
      </View>
      <View style={styles.formArea}>
        <TextInput
          style={styles.textForm}
          label={"E-mail"}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.textForm}
          label={"Password"}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <View style={styles.buttonArea}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => handlingLogin()}
        >
          Login
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => {
            navigation.push("Register");
            console.log("press register button!");
          }}
        >
          Register
        </Button>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
    // justifyContent: 'center',
  },
  titleArea: {
    width: "100%",
    paddingTop: wp("20%"),
    paddingBottom: wp("20%"),
    alignItems: "center",
  },
  title: {
    fontSize: wp("8%"),
  },
  formArea: {
    width: "100%",
    paddingBottom: wp("10%"),
  },
  textForm: {
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 10,
  },
  buttonArea: {
    width: "100%",
    height: hp("5%"),
  },
  button: {
    backgroundColor: "#46c3ad",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonTitle: {
    color: "white",
  },
});
