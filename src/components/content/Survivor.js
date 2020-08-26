import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Divider,
  List,
  Badge,
  IconButton,
  Colors,
} from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getReports } from "../../api/survivorAPI";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    paddingTop: wp("10%"),
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
    // justifyContent: "center",
    // alignItems: "center",
  },
  badge: {
    backgroundColor: "blue",
    marginBottom: 15,
    marginLeft: 8,
    marginRight: 27,
  },
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const ListView = ({ elem, index, navigation }) => {
  let component = "";
  switch (index) {
    case 1:
      component = (
        <>
          <List.Item
            title={`최후의 생존자 '${elem.name}' 님`}
            description={elem.pub_date}
            left={(props) => <List.Icon {...props} icon="crown" />}
            right={(props) => (
              <IconButton
                icon="chat"
                color={Colors.red500}
                size={20}
                onPress={() =>
                  navigation.navigate("Chat", {
                    screen: "ChatDetail",
                    params: { title: elem.name, receiverName: elem.name },
                  })
                }
              />
            )}
          />
        </>
      );
      break;
    default:
      component = (
        <>
          <List.Item
            title={`'${elem.name}' 님`}
            description={elem.pub_date}
            left={(props) => (
              <Badge style={styles.badge} size={20}>
                {index}위
              </Badge>
            )}
            right={(props) => (
              <IconButton
                icon="chat"
                color={Colors.red500}
                size={20}
                onPress={() =>
                  navigation.navigate("Chat", {
                    screen: "ChatDetail",
                    params: { title: elem.name, receiverId: elem.name },
                  })
                }
              />
            )}
          />
        </>
      );
  }
  return component;
};

export const Survivor = ({ navigation }) => {
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
      {survivors.map((elem, idx) => (
        <>
          <ListView
            key={idx}
            elem={elem}
            index={idx + 1}
            navigation={navigation}
          />
          <Divider/>
        </>
      ))}
    </ScreenContainer>
  );
};
