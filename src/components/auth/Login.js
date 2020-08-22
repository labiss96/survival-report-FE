import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { onLogin } from "../../api/authAPI";
import { AuthContext } from "../../context";

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Login = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);

  const [email, setEmail] = useState("cxz9080@gmail.com");
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
        console.log(result);
        signIn(result.data.token, result.data.userId);
      })
      .catch((err) => {
        console.log(err);
        alert("아이디 또는 비밀번호가 틀립니다!");
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
          placeholder={"E-mail"}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.textForm}
          placeholder={"Password"}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.button} onPress={() => handlingLogin()}>
          <Text style={styles.buttonTitle}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push("Register");
            console.log("press register button!");
          }}
        >
          <Text style={styles.buttonTitle}>Register!</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    borderWidth: 0.5,
    borderColor: "#888",
    width: "100%",
    height: hp("5%"),
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
