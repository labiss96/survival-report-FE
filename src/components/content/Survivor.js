import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
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
import { theme } from '../../core/theme';


const ListView = ({ elem, index, navigation }) => {
  const store = useAuthStore();

  return (
    <List.Item
      title={index === 1 ? `최후의 생존자 '${elem.name}' 님` : `'${elem.name}' 님`}
      description={elem.pub_date}

      left={(props) => {
        return index === 1 ? (
        <List.Icon {...props} icon="crown" color={theme.colors.primary} /> 
        ) : (
        <Badge style={styles.badge} size={20}>{index}위</Badge>
        );
      }}

      right={(props) => {
          return elem.id !== Number(store.userId) ? (
            <IconButton
              icon="chat"
              color={theme.colors.primary}
              size={20}
              onPress={() => {
                store.setReceiver(elem.id, elem.name);
                return (
                  navigation.navigate("Chat", {
                    screen: "ChatDetail",
                    params: { title: elem.name },
                  })
                );
              }}
            />
          ):(<></>);
        }
      }
    />
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: wp("10%"),
    paddingLeft: wp("10%"),
    paddingRight: wp("10%"),
  },
  badge: {
    backgroundColor: theme.colors.secondary,
    marginBottom: 15,
    marginLeft: 8,
    marginRight: 27,
  },
  icon: {
    color: theme.colors.primary,
  }
});