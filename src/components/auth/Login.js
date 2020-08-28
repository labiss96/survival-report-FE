import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";

import { theme } from '../../core/theme';
import { emailValidator, passwordValidator } from '../../core/utils';
import { onLogin } from "../../api/authAPI";

import { useAuthStore } from "../../store/authContext";
import Background from "../common/Background";
import TextInput from '../common/TextInput';

export const Login = ({ navigation }) => {
  const store = useAuthStore();

  const [email, setEmail] = useState({ value: 'cxz9080@likelion.org', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const handlingLogin = async () => {
    //console.log(`email : ${email}`);
    //console.log(`pw : ${password}`);

    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    //API 통신
    await onLogin({
      email: email.value,
      password: password.value,
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
              navigation.push("Auth", { email: email.value });
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
      <Image source={require('../../assets/logo_icon.png')} style={styles.logo} />
      <View>
        <Text style={styles.header}>Report of Survivor</Text>
      </View>
      
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

      <Button 
      style={styles.button}
      labelStyle={styles.text}
      mode="contained" onPress={handlingLogin}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 128,
    height: 128,
    marginBottom: 12,
    tintColor: theme.colors.primary,

  },
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});
