import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { onRegister } from "../../api/authAPI";

import Progress from "../Progress";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
    // justifyContent: "center",
    alignItems: "center",
  },
  titleArea: {
    width: "100%",
    paddingTop: wp("10%"),
    paddingBottom: wp("10%"),
    alignItems: "center",
  },
  title: {
    fontSize: wp("8%"),
  },
  formArea: {
    width: "100%",
    paddingBottom: wp("5%"),
  },
  textForm: {
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 15,
  },
  buttonArea: {
    width: "70%",
    height: 35,
  },
  button: {
    backgroundColor: "#46c3ad",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {
    color: "white",
  },
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Register = ({ navigation }) => {
  // const { signIn } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerHandling = async () => {
    if (email !== "" && password !== "" && name !== "") {
      setIsLoading(true);
      //register API
      const data = {
        email: email,
        name: name,
        password: password,
      };

      await onRegister(data)
        .then((result) => {
          console.log(result);
          alert("계정이 생성되었습니다! 메일로 이동하여 인증을 완료해주세요");
          navigation.push("Auth", { email: email });
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
    } else {
      alert("정보를 모두 입력해주세요");
    }
  };
  // navigation.push("Auth")

  return (
    <ScreenContainer>
      <View style={styles.titleArea}>
        <Text style={styles.title}>회원가입</Text>
      </View>
      <View style={styles.formArea}>
        <TextInput
          style={styles.textForm}
          label={"E-mail"}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textForm}
          label={"Name"}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.textForm}
          label={"Password"}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.textForm}
          label={"confirm Password"}
          onChangeText={(text) => setPassword2(text)}
        />
      </View>
      <View style={styles.buttonArea}>
        {isLoading ? (
          <Progress />
        ) : (
          <Button
            mode="contained"
            onPress={() => registerHandling()}
            style={styles.button}
          >
            Signup
          </Button>
        )}
      </View>
    </ScreenContainer>
  );
};
