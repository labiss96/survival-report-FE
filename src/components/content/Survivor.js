import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../context";

import { getReports } from "../../api/survivorAPI";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const ListView = ({ elem, index }) => {
  let component = "";
  switch (index) {
    case 1:
      component = (
        <View>
          <Text>최고의 생존자 '{elem.name}'님</Text>
          <Text>생존 시각 : {elem.pub_date}</Text>
          <Text>---------------------------------------------------------</Text>
        </View>
      );
      break;
    default:
      component = (
        <View>
          <Text>
            {index}위 '{elem.name}'님
          </Text>
          <Text>생존 시각 : {elem.pub_date}</Text>
          <Text>
            ----------------------------------------------------------------
          </Text>
        </View>
      );
  }
  return component;
};

export const Survivor = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [survivors, setSurvivors] = useState([]);

  const getSurvivorList = async () => {
    await getReports().then((result) => {
      console.log(result.data);
      setSurvivors(result.data.report_list);
    });
  };

  useEffect(() => {
    getSurvivorList();
  }, []);

  return (
    <ScreenContainer>
      <View>
        <Text>생존자 리스트</Text>
        <Text>=======================================</Text>
      </View>
      {survivors.map((elem, idx) => (
        <ListView key={idx} elem={elem} index={idx + 1} />
      ))}
      <Button title="Sign Out" onPress={() => signOut()} />
    </ScreenContainer>
  );
};
