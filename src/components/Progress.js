import React from "react";
import { View, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
 
export default () => {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {/* <Progress.CircleSnail /> */}
            {/* <Progress.Bar width={200} /> */}
            <ActivityIndicator />
        </View>
    );
}
