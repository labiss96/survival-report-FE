import { callAPI } from "./api-config";

//채팅 리스트
const getChatList = (userId) => {
  return callAPI("GET", `chat/${userId}`, null);
};

const getChatLog = (userId, receiverId) => {
  console.log(`userid는 (${userId}), 리시버아이디는 (${receiverId})`);
  return callAPI("POST", `chat/${userId}`, {receiver_id: receiverId});
}

export { getChatList, getChatLog };
