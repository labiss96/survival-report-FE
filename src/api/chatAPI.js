import { callAPI } from "./api-config";

//채팅 리스트
const getChatList = (userId) => {
  return callAPI("GET", `chat/${userId}`, null);
};

//const getReports = () => {
//  return callAPI("GET", "report/list", null);
//};

export { getChatList };
