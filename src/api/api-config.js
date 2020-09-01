import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { _URL } from "../config/severConfig";

axios.defaults.baseURL = `http://${_URL}`;
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

const callAPI = async (method, url, data) => {
  console.log(`run ${method}:: '${url}' API.`);
  const config = await tokenConfig();
  switch (method) {
    case "GET":
      return axios.get(url, config);
    case "POST":
      return axios.post(url, JSON.stringify(data), config);
    case "PUT":
      return axios.put(url, JSON.stringify(data), config);
    case "DELETE":
      return axios.delete(url, JSON.stringify(data), config);
  }
};

export { tokenConfig, callAPI };
