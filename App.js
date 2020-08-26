import "react-native-gesture-handler";
import React from "react";
import AppStack from "./src/index";
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

const App = () => {
  return <AppStack />;
};

export default App;
