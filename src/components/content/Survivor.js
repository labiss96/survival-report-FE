import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Divider,
  List,
  Badge,
  IconButton,
  Colors,
} from "react-native-paper";
import { useAuthStore } from "../../store/authContext"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { getReports } from "../../api/survivorAPI";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: wp("10%"),
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
  },
  badge: {
    backgroundColor: "blue",
    marginBottom: 15,
    marginLeft: 8,
    marginRight: 27,
  },
});


const ListView = ({ elem, index, navigation }) => {
  let component = "";
  const store = useAuthStore();

  return (
    <List.Item
            title={`최후의 생존자 '${elem.name}' 님`}
            description={elem.pub_date}
            left={(props) => {return (index === 1 ? <List.Icon {...props} icon="crown" /> : <Badge style={styles.badge} size={20}>{index}위</Badge>);}}
            right={(props) => (
              <IconButton
                icon="chat"
                color={Colors.red500}
                size={20}
                onPress={() => {
                  store.setReceiver(elem.id, elem.name);
                  return (
                    navigation.navigate("Chat", {
                      screen: "ChatDetail",
                      params: { title: elem.name },
                    }
                  ));
                }}
              />
            )}
          />
  );
  //switch (index) {
  //  case 1:
  //    component = (
  //      <>
  //        <List.Item
  //          title={`최후의 생존자 '${elem.name}' 님`}
  //          description={elem.pub_date}
  //          left={(props) => <List.Icon {...props} icon="crown" />}
  //          right={(props) => (
  //            <IconButton
  //              icon="chat"
  //              color={Colors.red500}
  //              size={20}
  //              onPress={() => {
  //                store.setReceiver(elem.id, elem.name);
  //                return (
  //                  navigation.navigate("Chat", {
  //                    screen: "ChatDetail",
  //                    params: { title: elem.name },
  //                  }
  //                ));
  //              }}
  //            />
  //          )}
  //        />
  //      </>
  //    );
  //    break;
  //  default:
  //    component = (
  //      <>
  //        <List.Item
  //          title={`'${elem.name}' 님`}
  //          description={elem.pub_date}
  //          left={(props) => (
  //            <Badge style={styles.badge} size={20}>
  //              {index}위
  //            </Badge>
  //          )}
  //          right={(props) => (
  //            <IconButton
  //              icon="chat"
  //              color={Colors.red500}
  //              size={20}
  //              onPress={() => {
  //                store.setReceiver(elem.id, elem.name);
  //                return (
  //                  navigation.navigate("Chat", {
  //                    screen: "ChatDetail",
  //                    params: { title: elem.name },
  //                  }
  //                ));
  //              }}
  //            />
  //          )}
  //        />
  //      </>
  //    );
  //}
  //return component;
};

export const Survivor = ({ navigation }) => {
  const store = useAuthStore();
  const [survivors, setSurvivors] = useState([]);

  const getSurvivorList = async () => {
    await getReports().then((result) => {
      console.log('생존자 리스트 데이터 >> ', result.data);
      setSurvivors(result.data.report_list);
    });
  };

  const refreshCallback = (message) => {
    console.log('run survivor list callback!');
    getSurvivorList();
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log('생존자리스트 focus 됨');
      getSurvivorList();
      store.setCallback(refreshCallback);
    });
    //const unsubscribe = 
    //return unsubscribe;
  }, [navigation]);

  return (
    <List.Section>
      {survivors.map((elem, key) => (
          <ListView
            key={Math.random()}
            elem={elem}
            index={key + 1}
            navigation={navigation}
          />
      ))}
    </List.Section>
  );
};
