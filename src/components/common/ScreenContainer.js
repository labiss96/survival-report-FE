import React from "react";
import { View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

export const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);
