import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { theme } from '../../core/theme';

import { onLogin } from "../../api/authAPI";

import { useAuthStore } from "../../store/authContext";
import Background from "../common/Background";
import TextInput from '../common/TextInput';

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
        console.log('로그인 잘 됬고,', result.data.userId);

        await store.initWebsocket(result.data.userId);
        console.log('소켓객체는 ???', store.websocket)

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
    <Background>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => alert('click forgot password!')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handlingLogin}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/*<View style={styles.titleArea}>
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
      </View>*/}
    </Background>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 128,
    height: 128,
    marginBottom: 12,
  },
});
