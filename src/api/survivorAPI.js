import { callAPI } from "./api-config";

//생존신고 데이터 생성 API
const onCreate = (data) => {
  return callAPI("POST", "report/", data);
};

const getReports = () => {
  return callAPI("GET", "report/list", null);
};

export { onCreate, getReports };
