import React , {useState}from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { AuthContext } from "../../context";
import { onLogin } from '../../api/authAPI';

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export const Login = ({ navigation }) => {
    const { signIn } = React.useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlingLogin = async () => {    
        console.log(`email : ${email}`);
        console.log(`pw : ${password}`);
    
        await onLogin({
            email : email,
            password: password
        }).then(result => {
            console.log(result);
            alert(result.data);
            if(result.status === 200 ) {
                signIn(result.data.key);
            }
        })
        .catch(err => {
            console.log(err);
            alert(err);
            return false;
        }
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.titleArea}>
                <Text style={styles.title}>Suvival Report</Text>
            </View>
            <View style={styles.formArea}>
                <TextInput
                    style={styles.textForm}
                    placeholder={"E-mail"} 
                    onChangeText = {text => setEmail(text)}
                    value = {email} />
                <TextInput
                    style={styles.textForm}
                    placeholder={"Password"}
                    onChangeText = {text => setPassword(text)}
                    value = {password} />
            </View>
            <View style={styles.buttonArea}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlingLogin() }>
                    <Text style={styles.buttonTitle}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.push("Register")}>
                    <Text style={styles.buttonTitle}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
};


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
        marginBottom: 10,
    },
    buttonTitle: {
        color: 'white',
    },
});