
import {client as RECEIVE, server as SEND} from './packetTypes';
import * as helper from './helper';
// import error from './error';
// import validate from './validate';
import channel from './channel';
// import session from './session';
// import Message from '../models/message';

const test = (connection, payload) => {
  const ch = channel.get(payload.channel);
  ch.push(connection.id);

  connection.data.channel = payload.channel;

  helper.emit(connection, helper.createAction(SEND.SUCCESS.ENTER, {
      userList: ch.getUserList()
  }));
}
const test1 = (connection, payload) => {
  // check session validity
  console.log('check session validaity');
  // console.log(connection);
  if (!connection.data.valid && 0) {
      // return helper.emit(connection, error(1, RECEIVE.MSG));
      console.log('check session fail');
      return;
  }

  if(connection.data.counter > 10) {
      connection.data.counter = 20;
      setTimeout(()=>{
          connection.data.counter = 0;
      }, 5000);
      // return helper.emit(connection, error(3));
      return;
  }

  chatCount(connection);
  const ch = channel.get(connection.data.channel);

  ch.broadcast(helper.createAction(SEND.MSG, {
      anonymous: connection.data.anonymous,
      username: connection.data.username,
      message: payload.message,
      date: (new Date()).getTime(),
      uID: payload.uID,
      suID: helper.generateUID()
  }), connection);


  const current = new Date();

  if(!connection.data.lastMessageDate) {
      // it is a first message

      /* create an activity */
  }
}

export default function packetHandler(connection, packet) {
  
      // log the packet (only in dev mode)
      if (process.env.NODE_ENV === 'development') {
          helper.log(packet);
      }
  
      const o = helper.tryParseJSON(packet);
      console.log('parse json result :');
      console.log(o ? 'true' : 'false');
  
      if (!o) {
          // INVALID REQUEST
          return helper.emit(connection, error(0));
      }
  
/*      
      // validate request
      if (!validate(o)) {
          return helper.emit(connection, error(0));
      }
*/      
  
      switch (o.type) {
          case RECEIVE.ENTER:
              // service.enter(connection, o.payload);
              test(connection, o.payload);
              break;
          // case RECEIVE.AUTH:
          //     service.auth(connection, o.payload);
          //     break;
          case RECEIVE.MSG:
              test1(connection, o.payload);
              break;
          default:
              // helper.emit(connection, error(0));
              break;
      }
  
  }

  function chatCount(connection) {
    connection.data.counter++;
    setTimeout(() => {
        connection.data.counter--;
        if(connection.data.counter < 0) {
            connection.data.counter = 0;
        }
    }, 5000)
}