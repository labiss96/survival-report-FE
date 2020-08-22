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

const onLogin = async (data) => {
  console.log("run login API.");
  console.log(data);
  const config = await tokenConfig();
  return axios.post("account/sign-in", JSON.stringify(data), config); //date : {email, password}
};

const onRegister = (data) => {
  console.log("run Register API");
  return axios.post("account/sign-up", JSON.stringify(data));
};

const checkValidation = async () => {
  console.log("run checkValidation API.");
  const config = await tokenConfig();
  return axios.get("account/validation", config);
};

export { tokenConfig, onLogin, onRegister, checkValidation };
