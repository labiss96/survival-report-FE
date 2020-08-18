import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


const onLogin = (data) => {
	console.log("run login API.");
	return axios.post("accounts/rest-auth/login/", data); //date : {username, password}
}

const tokenConfig = () => {
	// const token = window.sessionStorage.getItem("token");
	const token = 'example token';
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  // const config = `Authorization:Token ${token}`;
  // console.log("token:", config);
  return config;
};

export { onLogin, tokenConfig }