import React, { useState, useEffect, useContext } from "react";
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

import { useAuthStore } from "../../store/authContext";
import AsyncStorage from "@react-native-community/async-storage";
import { onCreate } from "../../api/survivorAPI";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
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
  button: {
    backgroundColor: "#46c3ad",
    width: "100%",
    height: hp("20%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonTitle: {
    color: "white",
  },
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Home = ({ navigation }) => {

  const store = useAuthStore();
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log("run useEffect : Home");
    console.log('report state >> ', store.reportFlag)
  });

  const reportHandling = async () => {
    let userId = await AsyncStorage.getItem("userId");
    await onCreate({ userId: userId })
      .then((result) => {
        console.log(result);
        alert("생존신고 완료!");
        store.setReport(true);
        store.socketReport();
      })
      .catch((err) => console.log(err));
  };

  return (
    <ScreenContainer>
      <View style={styles.titleArea}>
        <Text style={styles.title}>생 존 신 고</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          reportHandling();
        }}
      >
        <Text style={styles.buttonTitle}>생존신고!</Text>
      </TouchableOpacity>
      <Button title="Sign Out" onPress={() => store.signOut()} />
    </ScreenContainer>
  );
};
