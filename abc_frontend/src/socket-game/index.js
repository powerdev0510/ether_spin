import SockJS from 'sockjs-client';
import notify from 'helpers/notify';
import handler from './packetHandler';
import * as helper from './helper';
import sender from './packetSender';
import store from 'store';

let intervalId = null;
let socket = null;
let closing = false;
let reconnected = false;
let _intl = null;

const messages = {
  "reconnect": "[GAME] Reconnected successfully",
  "disconnect": "[GAME] Disconnected from server. Reconnecting..."
}

// creates action object
function createAction(type, payload) {
  return {type, payload};
}

export const init = () => {
  socket = new SockJS("http://18.217.245.201:8080/game");

  socket.onopen = () => {
    closing = false;

    console.log('--------------------------init()--------------------');
    const channel = store.getState().game.getIn(['channel', 'game', '_id']);
    console.log(channel);
    sender.enter(channel);

    if(reconnected) {
      notify({type: 'success', message: messages.reconnect});
      // if(store.getState().chat.get(['chat','socket','auth'])) {
      //   sender.reauth();
      // }
    }

    reconnected = false;
  }

  socket.onmessage = (e) => {
    if(process.env.NODE_ENV === 'development') {
      helper.log(e.data);
      console.log(e.data);
    }
    handler(e.data);
  }

  socket.onclose = () => {
    socket = null;

    if(!closing) {
      if(!reconnected) {
        notify({type: 'error', message: messages.disconnect});
      }
      reconnected = true;
      // intervalId = setInterval(function () {
      //     init();
      // }, 2000);
    } else {
      console.log("[SOCKET] disconnected");
    }
  }
}

export const send = (data) => {
  socket.send(JSON.stringify(data));
}

export const close = () => {
  closing = true;
  socket.close();
}

export const getSocket = () => {
  return socket;
}

