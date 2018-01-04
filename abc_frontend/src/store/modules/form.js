import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

// action types
const CHANGE_INPUT = 'form/CHANGE_INPUT';
const SET_INPUT_ERROR = 'form/SET_INPUT_ERROR';
const FORM_RESET = 'form/FORM_RESET';
const FORM_ERROR_RESET = 'form/FORM_ERROR_RESET';

// action creator
/*
    payload: {
        form,
        name,
        value
    }
*/
export const changeInput = createAction(CHANGE_INPUT);
export const setInputError = createAction(SET_INPUT_ERROR);
/* empty payload */
export const formReset = createAction(FORM_RESET);
export const resetError = createAction(FORM_ERROR_RESET);

// initial state
const initialState = Map({
    register: Map({
        username: '',
        password: ''
    }),
    additional: Map({
        firstName: '',
        lastName: '',
        email: '',
        gender: ''
    }),
    additional_o: Map({
        username: ''
    }),
    login: Map({
        username: '',
        password: ''
    }),
    chat: Map({
        message: ''
    }),
    error: Map({
        register: Map({
            username: false,
            password: false
        }),
        additional: Map({
            firstName: false,
            lastName: false,
            email: false,
            gender: false
        }),
        additional_o: Map({
            username: false
        }),
        accountSetting: Map({
            currentPassword: false,
            password: false,
            confirmPassword: false,
            email: false,
            givenName: false,
            familyName: false
        }),
        channelSetting: Map({
            statusMessage: false
        })
    }),
    search: Map({
        keyword: ''
    }),

    accountSetting: {
        currentPassword: '',
        password: '',
        confirmPassword: '',
        email: '',
        givenName: '',
        familyName: ''
    },

    channelSetting: {
        statusMessage: ''
    },
    deposit: Map({
        balance: '500',
        amount: ''
    }),
});

// reducer
export default handleActions({
    [CHANGE_INPUT]: (state, action) => {
        const { form, name, value } = action.payload;
        return state.setIn([form, name], value);
    },
    [SET_INPUT_ERROR]: (state, action) => {
        const { form, name, error } = action.payload;
        return state.setIn(['error', form, name], error);
    },
    [FORM_ERROR_RESET]: (state, action) => {
        return state.set('error', initialState.error);
    },
    [FORM_RESET]: (state, action) => {
        return initialState;
    },
       
  }, initialState); 