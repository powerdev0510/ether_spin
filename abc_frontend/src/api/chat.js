import axios from 'axios';

export const getRecentMsg = () => {
  return axios.get('http://18.217.245.201:8080/api/v1.0/chat/broadcast');
}