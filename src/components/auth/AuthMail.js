import React, { useState } from "react";
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

import { sendAuthMail } from "../../api/authAPI";

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
    paddingBottom: wp("5%"),
  },
  textForm: {
    borderWidth: 0.5,
    borderColor: "#888",
    width: "100%",
    height: hp("5%"),
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
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

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const AuthMail = ({ route, navigation }) => {
  //   const [email, setEmail] = useState("cxz9080@gmail.com");
  // const [email, setEmail] = useState("dskfldsl@mfkdsmf.fd");
  const { email } = route.params;

  const handlingSendMail = async () => {
    await sendAuthMail({ email: email })
      .then((result) => {
        console.log(result);
        alert("해당 이메일로 인증코드를 재 발송하였습니다!");
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
        console.log(error.config);
      });
  };

  return (
    <ScreenContainer>
      <View style={styles.titleArea}>
        <Text style={styles.title}>E-Mail 인증</Text>
      </View>
      <View style={styles.formArea}>
        <TextInput style={styles.textForm} value={email} />
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handlingSendMail();
          }}
        >
          <Text style={styles.buttonTitle}>인증코드 재발송</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.buttonTitle}>로그인</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};
