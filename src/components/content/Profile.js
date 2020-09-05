import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Image
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { checkValidation } from "../../api/authAPI";
import Background from "../common/Background";
import { theme } from '../../core/theme';

import { useAuthStore } from "../../store/authContext";

export const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const store = useAuthStore();

  const getUserInfo = async () => {
    await checkValidation()
      .then((result) => {
        console.log("user data : ", result.data.user);
        setUserInfo(result.data.user);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Background>
      <View>
        <Text style={styles.header}>PROFILE</Text>
      </View>
      <Image source={require('../../assets/profile_icon.png')} style={styles.logo} />
      <View>
        <Text style={styles.name}>{userInfo.name}</Text>
      </View>
      <View>
        <Text style={styles.email}>{userInfo.email}</Text>
      </View>

      <View style={styles.signout}>
        <TouchableOpacity onPress={store.signOut}>
          <Text style={styles.label}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};


const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    //color: theme.colors.primary,
    //fontWeight: 'bold',
    paddingVertical: 14,
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  email: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  logo: {
    width: 128,
    height: 128,
    marginBottom: 12,
  },
  signout: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});