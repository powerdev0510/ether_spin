import { createAction, handleActions } from 'redux-actions';

import { Map, List, fromJS, toJS } from 'immutable';

// action types
const TEST_ACTION = 'chat/TEST_ACTION';

const INITIALIZE = 'chat/CHANNEL_INITIALIZE';
const CHECK_INFO = 'chat/CHANNEL_CHECK_INFO';
const SET_IDENTITY = 'chat/SET_IDENTITY';
const SET_SOCKET_STATE = 'chat/SET_SOCKET_STATE';
const RECEIVE_REALTIME_DATA = 'chat/RECEIVE_REALTIME_DATA';
const WRITE_MESSAGE = 'chat/WRITE_MESSAGE';
const MESSAGE_FAILURE = 'chat/MESSAGE_FAILURE';
const REMOVE_MESSAGE = 'chat/REMOVE_MESSAGE';

// action creator
export const doTestAction = createAction(TEST_ACTION); // test redux

export const initialize = createAction(INITIALIZE);
export const setIdentity = createAction(SET_IDENTITY);
// export const checkInfo = (username) => ({
//     type: CHECK_INFO,
//     payload: {
//         promise: service.checkInfo(username)
//     }
// });

export const setSocketState = createAction(SET_SOCKET_STATE);

export const receiveRealtimeData = createAction(RECEIVE_REALTIME_DATA);
export const writeMessage = createAction(WRITE_MESSAGE);
export const messageFailure = createAction(MESSAGE_FAILURE);
export const removeMessage = createAction(REMOVE_MESSAGE);

// initial state

const initialState = Map({
  test: Map({
    mode: false
  }),

  //added 
  valid: false,
  info: Map({
      username: null,
      familyName: null,
      givenName: null,
      thumbnail: "none",
      talkers: 0,
      following: 0,
      followers: 0,
      isFavorite: false
  }),
  focusBox: Map({
      userList: List([]),
      isLast: false,
      listIndex: -1
  }),
  chat: Map({
      userList: List([]),
      identity: null,
      socket: Map({
          enter: false,
          auth: null,
          username: null,
          controlled: false
      }),
      data: List([]),
      tempDataIndex: List([]),
      top: true,
      lastInitId: null,
      loadedBetween: false,
      statusMessage: ''
  }),
});

// reducer
export default handleActions({
  [TEST_ACTION]: (state, action) => {
    return state.setIn(['test', 'mode'], true);
    // return state.setIn(['test', 'mode'], action.payload);
  },

  [INITIALIZE]: (state, action) => {
    return initialState.setIn(['info', 'username'], action.payload);
    // return state.setIn(['test', 'mode'], action.payload);
  },
  
  [SET_SOCKET_STATE]: (state, action) => {
    console.log('[TEST:02](action.payload)----------->');
    console.log(action.payload);
    const { auth, username } = action.payload;
    return state.setIn(['chat', 'socket', 'auth'], auth)
                .setIn(['chat', 'socket', 'username'], username);
    // return state.setIn(['test', 'mode'], action.payload);
  },

  [WRITE_MESSAGE]: (state, action) => {
    
    const oldChatData = state.getIn(['chat', 'data']).toJS();
    const state1 = state.setIn(['chat', 'data'], 
                  fromJS( [...oldChatData, {...action.payload, temp: true } ] ) 
                );
    // console.log(temp);
    const temp = state1.getIn(['chat', 'tempDataIndex']).toJS();
    
    return state1.setIn(['chat', 'tempDataIndex'], fromJS([...temp, state1.getIn(['chat', 'data']).toJS().length-1]));
  },

  [RECEIVE_REALTIME_DATA]: (state, action) => {
    if( state.getIn(['chat', 'tempDataIndex']).toJS().length < 1) {
      const data = state.getIn(['chat', 'data']).toJS();
      const new_data = [...data, ...action.payload];
      return state.setIn(['chat', 'data'], fromJS(new_data));
    }
    // return {...state};
    console.log(action.payload);
    let tempData = null;
    let indexes = null;

    for (let packet of action.payload) {
      const username = state.getIn(['chat', 'socket', 'username']);
      console.log('[TEST:01(username)]-------->DATA: ' +  username);
      if (packet.type === 'MSG' && packet.payload.username === username) {
        // store tempData if null
        if (!tempData) 
          tempData = state.getIn(['chat', 'data']).toJS();
        if (!indexes) 
          indexes = state.getIn(['chat', 'tempDataIndex']).toJS();

        for (let i = 0; i < indexes.length; i++) {
          let index = indexes[i];
          if (tempData[index].payload.uID === packet.payload.uID) {
            tempData[index] = packet;
            indexes = [
                ...indexes.slice(0, i),
                ...indexes.slice(i + 1, indexes.length)
            ];
            console.log(packet, i, index);
          }          
        }
      }
    }

    if(tempData){
      // there was some modification
      console.log('[TEST:03(modifi)]-------->DATA: ' + JSON.stringify(tempData));
      return state.setIn(['chat', 'data'], fromJS(tempData))
        .setIn(['chat', 'tempDataIndex'], fromJS(indexes));
    }

    const temp = state.getIn(['chat', 'data']).toJS();
    console.log(temp);
    return state.setIn(['chat', 'data'], fromJS([...temp, ...action.payload]));
  },
}, initialState);