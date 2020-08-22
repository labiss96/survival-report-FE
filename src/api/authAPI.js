import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

axios.defaults.baseURL = "http:/192.168.0.9:8000/";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const tokenConfig = async () => {
  let token = null;
  try {
    token = await AsyncStorage.getItem("userToken");
    console.log("token :", token);
  } catch (e) {
    console.log(e);
  }

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // if (token) {
  //   // config.headers["Authorization"] = `Token ${token}`;
  //   config.headers["Authorization"] = `${token}`;
  // }
  config.headers["Authorization"] = token;

  return config;
};

const onLogin = (data) => {
  console.log("run login API.");
  console.log(data);
  return axios.post("account/sign-in", JSON.stringify(data), tokenConfig()); //date : {email, password}
};

const onRegister = (data) => {
  console.log("run Register API");
  return axios.post("account/sign-up", JSON.stringify(data));
};

export { onLogin, onRegister, tokenConfig };
