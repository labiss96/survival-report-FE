import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { onRegister } from '../../api/authAPI';

import Progress from '../Progress';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: wp('10%'),
        paddingRight: wp('10%'),
        // justifyContent: 'center',
    },
    titleArea: {
        width: '100%',
        paddingTop: wp('20%'),
        paddingBottom: wp('20%'),
        alignItems: 'center',
    },
    title: {
        fontSize: wp('8%'),
    },
    formArea: {
        width: '100%',
        paddingBottom: wp('10%'),
    },
    textForm: {
        borderWidth: 0.5,
        borderColor: '#888',
        width: '100%',
        height: hp('5%'),
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 10,
    },
    buttonArea: {
        width: '100%',
        height: hp('5%'),
    },
    button: {
        backgroundColor: "#46c3ad",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        color: 'white',
    },
  });
  
  const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
  );

export const Register = ({ navigation }) => {
    // const { signIn } = React.useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const registerHandling = async () => {
        
        if(email !== '' && password !== '' && name !== '') {
            setIsLoading(true);
            //register API 
            const data = {
                email: email,
                name: name,
                password: password
            }

            await onRegister(data).then(result => {
                console.log(result);
                alert('계정이 생성되었습니다! 메일로 이동하여 인증을 완료해주세요');
                navigation.push('Auth');
                setIsLoading(false);
            }).catch(err => {
                console.log(err);
                setIsLoading(false);
            });

            
        } else {
            alert('정보를 모두 입력해주세요');
        }
    }
    // navigation.push("Auth")

    return (
      <ScreenContainer>
        <View style={styles.titleArea}>
                    <Text style={styles.title}>Suvival Report</Text>
                </View>
                <View style={styles.formArea}>
                    <TextInput 
                        style={styles.textForm} 
                        placeholder={"E-mail"}
                        onChangeText = {text => setEmail(text)} />
                    <TextInput 
                        style={styles.textForm} 
                        placeholder={"Name"}
                        onChangeText = {text => setName(text)} />
                    <TextInput 
                        style={styles.textForm} 
                        placeholder={"Password"}
                        onChangeText = {text => setPassword(text)} />
                    <TextInput 
                        style={styles.textForm} 
                        placeholder={"confirm Password"}
                        onChangeText = {text => setPassword2(text)} />
                </View>
                <View style={styles.buttonArea}>
                    {isLoading ? (<Progress/>):(
                        <TouchableOpacity 
                        style={styles.button}
                        onPress={() => registerHandling()}>
                            <Text style={styles.buttonTitle}>Signup</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
      </ScreenContainer>
    );
  };

