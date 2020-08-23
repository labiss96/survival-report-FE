import { callAPI } from "./api-config";

const onLogin = (data) => {
  return callAPI("POST", "account/sign-in", data);
};

const onRegister = (data) => {
  return callAPI("POST", "account/sign-up", data);
};

const checkValidation = () => {
  return callAPI("GET", "account/validation", null);
};

export { onLogin, onRegister, checkValidation };
