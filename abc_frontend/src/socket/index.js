import SockJS from 'sockjs-client';

import Worker from './worker';

let socket = null;

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

export const init = () => {  
  socket = new SockJS("http://192.168.0.116:8080/echo");

  socket.onopen = () => {
    console.log('[SOCKET] open evented');
    Worker.start();
    start();
  }

  socket.onmessage = (e) => {
    console.log('[SOCKET] message evented');

    if(process.env.NODE_ENV === 'development') {
      // helper.log(e.data);
      console.log(e.data);
    }
    
    try{
      const o = JSON.parse(e.data);

      if (o && typeof o === "object") {
        if(o.type === "MSG"){
          Worker.assign(o);
        }
      }
    }catch (e) {
      console.log('packet parse error!');
      console.log(e);
    }

  }

  socket.onclose = () => {
    console.log('[SOCKET] close evented');
    
    socket = null;

    console.log("[SOCKET] disconnected");
    Worker.stop();
  }
}

export const send = (data) => {
  socket.send(JSON.stringify(data));
}

export const close = () => {
  // closing = true;
  socket.close();
}

export const getSocket = () => {
  return socket;
}