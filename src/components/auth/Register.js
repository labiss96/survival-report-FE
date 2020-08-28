import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";

import { theme } from '../../core/theme';
import { emailValidator, passwordValidator, nameValidator } from '../../core/utils';

import { onRegister } from "../../api/authAPI";
import Background from "../common/Background";
import TextInput from '../common/TextInput';
import { Keyboard } from 'react-native'


import Progress from "../Progress";

//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    // backgroundColor: "white",
//    paddingLeft: wp("10%"),
//    paddingRight: wp("10%"),
//    // justifyContent: "center",
//    alignItems: "center",
//  },
//  titleArea: {
//    width: "100%",
//    paddingTop: wp("10%"),
//    paddingBottom: wp("10%"),
//    alignItems: "center",
//  },
//  title: {
//    fontSize: wp("8%"),
//  },
//  formArea: {
//    width: "100%",
//    paddingBottom: wp("5%"),
//  },
//  textForm: {
//    width: "100%",
//    paddingLeft: 5,
//    paddingRight: 5,
//    marginBottom: 15,
//  },
//  buttonArea: {
//    width: "70%",
//    height: 35,
//  },
//  button: {
//    backgroundColor: "#46c3ad",
//    width: "100%",
//    height: "100%",
//    justifyContent: "center",
//    alignItems: "center",
//  },
//  buttonTitle: {
//    color: "white",
//  },
//});


export const Register = ({ navigation }) => {
  
  const [email, setEmail] = useState({ value: '', error: '' });
  const [name, setName] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [password2, setPassword2] = useState({ value: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handlingRegister = async () => {
    
    setIsLoading(true);

    const emailError = emailValidator(email.value);
    const nameError = nameValidator(name.value);
    const passwordError = passwordValidator(password.value);
    const password2Error = passwordValidator(password2.value);

    if (emailError || nameError || passwordError || password2Error) {
      setEmail({ ...email, error: emailError });
      setName({ ...password, error: passwordError });
      setPassword({ ...password, error: passwordError });
      setPassword2({ ...password2, error: password2Error });

      setIsLoading(false);
      return;
    }

    if(password.value !== password2.value) {
      alert('비밀번호가 다릅니다. 정확히 입력해주세요!');

      setIsLoading(false);
      return;
    }

    const data = {
      email: email.value,
      name: name.value,
      password: password.value,
    };
    //register API  
    await onRegister(data)
      .then((result) => {
        console.log(result);
        alert("계정이 생성되었습니다! 메일로 이동하여 인증을 완료해주세요");
        
        navigation.push("Auth", { email: email.value });
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.log("response");
          alert(err.response.data.message);
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log("request");
          console.log(err.request);
        } else {
          console.log(err);
        }
        // console.log(error.config);

        setIsLoading(false);
      });
  };

  return (
    <Background>
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
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        blurOnSubmit={false}
        onSubmitEditing={()=> Keyboard.dismiss()}
      />

      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={password2.value}
        onChangeText={text => setPassword2({ value: text, error: '' })}
        error={!!password2.error}
        errorText={password2.error}
        secureTextEntry
        blurOnSubmit={false}
        onSubmitEditing={()=> Keyboard.dismiss()}
      />


      {isLoading ? 
      (
       <Progress />
      ) : (
        <Button 
          style={styles.button}
          labelStyle={styles.text}
          mode="contained" onPress={handlingRegister}>
            Register
        </Button>
      )}

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