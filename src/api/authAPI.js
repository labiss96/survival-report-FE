import axios from "axios";
axios.defaults.baseURL = "http://121.135.181.35:8080/";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const tokenConfig = () => {
	// const token = window.sessionStorage.getItem("token");
	const token = 'example token';
  // Headers
  const config = {
    headers: {
      // "Content-Type": "application/json"
      "Content-Type": "application/x-www-form-urlencoded", 
      Accept: "application/json"
      // "Content-Type": "x-www-form-urlencoded"
    }
  };

  if (token) {
    config.headers["Authorization"] = `Token b8655e674ccf4a6f82928ae5fc389b4d3e7b748d`;
  }
  return config;
};

const onLogin = (data) => {
	console.log("run login API.");
  // return axios.post("rest-auth/login/", data, tokenConfig()); //date : {username, password}
  
  return axios.get("rest-auth/user/", null , tokenConfig()); //date : {username, password}
}



export { onLogin, tokenConfig }