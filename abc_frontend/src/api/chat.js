import axios from 'axios';

export const getRecentMsg = () => {
  return axios.get('http://192.168.0.116:8080/api/v1.0/chat/broadcast');
}