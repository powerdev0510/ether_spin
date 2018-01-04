import axios from 'axios';

export const findGame = (type) => {
  return axios.get(`/api/v1.0/game/find/type/${type}`);
}

export const deposit = (userId, type, gameId, amount) => {
  return axios.post(`/api/v1.0/game/deposit`, 
                    { 
                      userId, type, gameId, amount
                    });
}

export const getGameData = (gameId) => {
  return axios.get(`/api/v1.0/game/id/${gameId}`);
}