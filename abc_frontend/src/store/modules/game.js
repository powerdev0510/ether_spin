import { createAction, handleActions } from 'redux-actions';

import { Map, List, fromJS, toJS } from 'immutable';
import * as GameApi from 'api/game';
import { pender } from 'redux-pender';

// server status code of deposit request, copied from 'game.ctrl.js'
// to update later

const DEPOSIT_CC = {
  DEPOSIT_OK: 0x00,
  ALREADY_DEPOSIT: 0x01,
  GAME_CLOSED: 0x02,
  DEPOSIT_FAIL : 0xFF
};

// action types
const TEST_ACTION = 'game/TEST_ACTION';
const FIND_GAME = 'game/FIND_GAME';
const DEPOSIT = 'game/DEPOSIT';
const UPDATE_GAMEDATA = 'game/UPDATE_GAMEDATA';
const GET_GAME_DATA='game/GET_GAME_DATA';
const GAME_ROOM_RESET='game/GAME_ROOM_RESET';

// action creator
export const doTestAction = createAction(TEST_ACTION); // test redux
export const findGame = createAction(FIND_GAME, GameApi.findGame); // find game
export const deposit = createAction(DEPOSIT, GameApi.deposit); // depoist 
export const updateGameData = createAction(UPDATE_GAMEDATA); // update game data from sever by socket 
export const getGameData = createAction(GET_GAME_DATA, GameApi.getGameData); // get game data from sever
export const gameRoomReset = createAction(GAME_ROOM_RESET); // reset game room

// initial state

const initialState = Map({
  test: Map({
    mode: false
  }),

  join: false,  
  error :Map({
    deposit: ''
  }),

  channel: Map({
    userList: List([]),
    identity: null,
    game: Map({
      _id : null,
      total: null,
      sold: null,
      usernames: {},
      deposits: {},
      state: 0, // OPEN
      winners: [],
      // usernames : [],
      // depositHistory : [],
    }),
    socket: Map({
        enter: false,
        auth: null,
        username: null,
        controlled: false
    }),
    data: List([]),
  }),
  
});

// reducer
export default handleActions({
  [TEST_ACTION]: (state, action) => {
    return state.setIn(['test', 'mode'], true);
    // return state.setIn(['test', 'mode'], action.payload);
  },
  [UPDATE_GAMEDATA]: (state, action) => {
    const { game } = action.payload;
    if( game ){
      console.log(`[UPDATE_GAMEDATA]=========>${game}`);
      return state.setIn(['channel', 'game'], fromJS(game));
    }
  },
  [GAME_ROOM_RESET]: (state, action) => {
    return initialState;
  },
  
  ...pender({
    type: DEPOSIT,
    onSuccess: (state, action) => {
      const { data: result } = action.payload;   
      const { cc } = result;

      if(cc === DEPOSIT_CC.DEPOSIT_OK){
        return state.set('join', true);
      }else{
        console.log(`DEPOSIT reqeust result=${cc}`);
        let errStr = '';
        switch (cc) {
          case DEPOSIT_CC.ALREADY_DEPOSIT:
            errStr = 'Already deposited';
            break;
          case DEPOSIT_CC.GAME_CLOSED:
            errStr = 'Game is closed';
            break;
          case DEPOSIT_CC.DEPOSIT_FAIL:
            errStr = 'Failed to deposit';
            break;
          default:
            errStr = 'Unknown error';
            break;
        }
        return state.setIn(['error', 'deposit'], errStr);
      }
    },
    onFailure: (state, action) => {

    }
  }),
  ...pender({
    type: FIND_GAME,
    onSuccess: (state, action) => {
      const { data: { game } } = action.payload;
      if( game ){
        console.log(`[FIND_GAME]=========>${game}`);
        return state.setIn(['channel', 'game'], fromJS(game));
      }
    },
    onFailure: (state, action) => {
      
    }
  }),
  ...pender({
    type: GET_GAME_DATA,
    onSuccess: (state, action) => {
      const { data: { game } } = action.payload;
      if( game ){
        console.log(`[GET_GAME_DATA]=========>${game}`);
        return state.setIn(['channel', 'game'], fromJS(game));
      }
    },
    onFailure: (state, action) => {
      
    }
  }),
}, initialState);