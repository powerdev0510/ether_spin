import SockJS from 'sockjs-client';

import Worker from './worker';
import sender from './packetSender';
import store from 'store';
import notify from 'helpers/notify';
import { prepareMessages } from 'locale/helper';
import * as helper from './helper';
import handler from './packetHandler';

let intervalId = null;
let socket = null;
let closing = false;
let reconnected = false;
let _intl = null;

// const messages = prepareMessages({
//     "Chat.notify.reconnect": "Reconnected successfully",
//     "Chat.notify.disconnect": "Disconnected from server. Reconnecting..."
// })
const messages = {
  "reconnect": "Reconnected successfully",
  "disconnect": "Disconnected from server. Reconnecting..."
}

// creates action object
function createAction(type, payload) {
  return {type, payload};
}


async function start() {
  const channel = 'aaa';
  send(createAction("ENTER", {channel}));

  const sessionID = (new Date()).toString(); //"dHkxl0zudajC19164Yqx2lQTJC94LEcN";

  send(createAction("AUTH", {
      sessionID,
      anonymous: true
  }));
}

export const configure = (intl) => {
  _intl = intl;
  handler.configure(intl);
}

export const init = () => {  
  socket = new SockJS("http://192.168.0.116:8080/echo");
  clearInterval(intervalId);
  socket.onopen = () => {
    closing = false;
    console.log('[SOCKET] open evented');
    Worker.start();
    sender.enter(store.getState().auth.get(['session', 'user', 'username']));

    if(reconnected) {
      notify({type: 'success', message: messages.reconnect})
      if(store.getState().chat.get(['chat','socket','auth'])) {
          sender.reauth();
      }
    }
    reconnected = false;
      // start();
  }

  socket.onmessage = (e) => {
    // console.log('[SOCKET] message evented');

    // if(process.env.NODE_ENV === 'development') {
    //   // helper.log(e.data);
    //   console.log(e.data);
    // }
    
    // try{
    //   const o = JSON.parse(e.data);

    //   if (o && typeof o === "object") {
    //     if(o.type === "MSG"){
    //       Worker.assign(o);
    //     }
    //   }
    // }catch (e) {
    //   console.log('packet parse error!');
    //   console.log(e);
    // }
    if(process.env.NODE_ENV === 'development') {
        helper.log(e.data);
    }
    handler(e.data);
  }

  socket.onclose = () => {
    socket = null;

    if (!closing) {
      console.log("[SOCKET] disconnected, reconnecting..")
      if(!reconnected) {
          notify({type: 'error', message: messages.disconnect});
      }
      reconnected = true;
      intervalId = setInterval(function () {
          init();
      }, 2000);
    } else {
        console.log("[SOCKET] disconnected");
        Worker.stop();
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