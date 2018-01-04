
import {client as RECEIVE, server as SEND} from './packetTypes';
import * as helper from './helper';
import error from './error';
// import validate from './validate';
import channel from './channel';
// import session from './session';
import Message from 'db/models/Message';
import User from 'db/models/User';

const auth = async (connection, payload) => {
    const ch = channel.get(connection.data.channel);
    
    // console.log(ch);
    // anonymous identity
    if (payload.anonymous && 0) { // later
        // connection.data.username = session.getAnonymousName(payload.sessionID, connection.data.channel);
        connection.data.anonymous = true;
        connection.data.lastMessageDate = null;
    } else {
        const account = await User.findById(payload.sessionID);        
        if (!account) {
            // username not found
            return helper.emit(connection, error(2, RECEIVE.AUTH));
        }

        // account is valid
        const username1 = account.displayName;
        // find the lastMessage
        // console.log('[1:]'+username1);
        const msg = await Message.getLastMessage({channel: connection.data.channel, username: username1});
        
        if(!msg) {
            connection.data.lastMessageDate = null;
        } else {
            connection.data.lastMessageDate = msg.date;
        }
        // console.log('[2:]'+username1);
        connection.data.username = username1;
        connection.data.userId = account._id;
        connection.data.anonymous = false;
    }
    // console.log('[3:]');
    connection.data.sessionID = payload.sessionID;
    connection.data.valid = true;
    ch.validate(connection.id);
    // console.log('[4:]');
    // console.log(ch);
    // console.log('[5:]');
    // console.log(connection);

    helper.emit(connection, helper.createAction(SEND.SUCCESS.AUTH, {username: connection.data.username}));

    // console.log('[6:]');
    // handles multiple window
    if (ch.countUser(connection.data.username) !== 1) {
        return;
    }

    // console.log('[7:]');
    // broadcast that user has joined
    ch.broadcast(helper.createAction(SEND.JOIN, {
        anonymous: connection.data.anonymous,
        username: connection.data.username,
        date: (new Date()).getTime(),
        suID: helper.generateUID()
    }));

}

const test = (connection, payload) => {
  const ch = channel.get(payload.channel);
  ch.push(connection.id);

  connection.data.channel = payload.channel;

  helper.emit(connection, helper.createAction(SEND.SUCCESS.ENTER, {
      userList: ch.getUserList()
  }));
}
const message = (connection, payload) => {
  // check session validity
  console.log('check session validaity');
  // console.log(connection);
  if (!connection.data.valid) {
    console.log('check session fail');
    return helper.emit(connection, error(1, RECEIVE.MSG));
  }
  

  if(connection.data.counter > 10) {
      connection.data.counter = 20;
      setTimeout(()=>{
          connection.data.counter = 0;
      }, 5000);
      return helper.emit(connection, error(3));
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
      console.log('packet');
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
          case RECEIVE.AUTH:
              auth(connection, o.payload);
              break;
          case RECEIVE.MSG:
              message(connection, o.payload);
              break;
          default:
              helper.emit(connection, error(0));
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