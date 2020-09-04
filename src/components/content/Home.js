import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { theme } from '../../core/theme';
import { Button } from "react-native-paper"
import Background from "../common/Background";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useAuthStore } from "../../store/authContext";

export const Home = ({ navigation }) => {

  const store = useAuthStore();

  useEffect(() => {
    console.log('report state >> ', store.reportFlag)
  });

  const reportHandling = () => {
    store.socketReport();
  };

  return (
    <Background>

      <View style={styles.titleArea}>
        <Text style={styles.title}>당신이 살아있다는 것을 알리세요!</Text>
      </View>

      <Button
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.text}
        mode="contained" onPress={reportHandling}>
        생존신고!
      </Button>

      <View style={styles.signout}>
        <TouchableOpacity
          onPress={store.signOut}
        >
          <Text style={styles.label}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
  signout: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  titleArea: {
    width: "100%",
    paddingBottom: wp("10%"),
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    marginVertical: 10,
    height: 150,
    borderRadius: 15
  },
  buttonContent: {
    height: 150,
    borderRadius: 15
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});
