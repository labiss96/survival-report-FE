import axios from "axios";
import { tokenConfig } from "./authAPI";
//생존신고 데이터 생성 API
const onCreate = async (data) => {
  console.log("run onCreate API");
  console.log("create report request data : ", data);

  const config = await tokenConfig();
  return axios.post("report/", JSON.stringify(data), config);
};

const getReports = async () => {
  console.log("run getReport API");

  const config = await tokenConfig();
  return axios.get("report/list", config);
};

export { onCreate, getReports };
