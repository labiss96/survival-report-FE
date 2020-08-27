import "react-native-gesture-handler";
import React from "react";
import AppStack from "./src/index";
import { YellowBox } from 'react-native';
import { AuthProvider } from "./src/store/authContext";
YellowBox.ignoreWarnings(['Remote debugger']);

const App = () => {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
};

export default App;
