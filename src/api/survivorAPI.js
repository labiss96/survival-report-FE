import axios from "axios";
import {tokenConfig} from './authAPI';
//생존신고 데이터 생성 API
const onCreate = async(data) => {
    console.log('run onCreate API');
    
    const config = await tokenConfig();
    return axios.post('report/', JSON.stringify(data), config);
  }
  
  
  export { onCreate }