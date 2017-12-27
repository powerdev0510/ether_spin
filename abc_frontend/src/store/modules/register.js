import { createAction, handleActions } from 'redux-actions';

import { Map } from 'immutable';

import { pender } from 'redux-pender';
import * as AuthAPI from 'api/auth';

// action type
const SUBMIT = 'register/SUBMIT';
const INITIALIZE = 'register/INITIALIZE';
const SET_SUBMIT_STATUS = 'register/SET_SUBMIT_STATUS';
const RESET_REGISTER_STATUS = 'register/RESET_REGISTER_STATUS';
// actions
export const submit = createAction(SUBMIT, AuthAPI.localRegister);
export const initialize = createAction(INITIALIZE);
export const setSubmitStatus = createAction(SET_SUBMIT_STATUS);
export const resetRegisterStatus = createAction(RESET_REGISTER_STATUS);

// initial state
const intialState = Map({
  nickname: '',
  error: null,
  result: null,
  usernameExists: false,
  emailExists: false,
  success: false,
  submitStatus: false,
  checkingUserName: false
});

// reducer
export default handleActions({
  [INITIALIZE]: (state, action) => intialState,
  [SET_SUBMIT_STATUS]: (state, action) => {
    return state.set('submitStatus', action.payload);
  },
  [RESET_REGISTER_STATUS]: (state, action) => {
    return intialState;
  },
  ...pender({
    type: SUBMIT,
    onSuccess: (state, action) => {
      const { data: user } = action.payload;
      return state.set('result', user);
    },
    onFailure: (state, action) => {
      const { status } = action.payload;
      if(!action.payload.response) return state;

      const { key } = action.payload.response.data;
      const handler = {
        displayName: () => {
          return state.set('displayNameExists', true);
        },
        email: () => {
          return state.set('redo', true);
        }
      };

      if(status === 409 && key) {
        console.log(key);
        return;
        // return handler(key);
      }

      return state;
    }
  })
}, intialState);