import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AuthContext } from "../context";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: wp('10%'),
        paddingRight: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export const Survivor = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);
    return (
        <ScreenContainer>
            <View>
                <Text>
                    Survivor Screen!
                </Text>
            </View>
            <Button title="Sign Out" onPress={() => signOut()} />
        </ScreenContainer>
    );
};

