import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';

axios.defaults.baseURL = "http://10.19.247.177:8000/";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const tokenConfig = async () => {
  // const token = window.sessionStorage.getItem("token");
  const token = null;
  try {
    token = await AsyncStorage.getItem('userToken');
    console.log('token :', token);
  } catch(e) {
    console.log(e);
  }
	
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
      // "Content-Type": "application/x-www-form-urlencoded", 
      // Accept: "application/json"
      // "Content-Type": "x-www-form-urlencoded"
    }
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};

const onLogin = (data) => {
  console.log("run login API.");
  // const _data = {
  //   email: "admin@admin.com",
  //   password: "cakecake"
  // }
  console.log(data);
  return axios.post("account/sign-in/", JSON.stringify(data), tokenConfig()); //date : {email, password}

}

const onRegister = (data) => {
  console.log('run Register API');
  return axios.post('account/sign-up', JSON.stringify(data));
}



export { onLogin, onRegister, tokenConfig }