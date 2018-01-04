
import * as helper from './helper';
import { error } from './error';
import { client as RECEIVE, server as SEND } from './packetTypes';
import RoomManager from './room';
import GameEngine from 'engine/gameEngine';
import User from 'db/models/User';

const game = {
  enter: (connection, payload) => {
    // get the channel (creates one if does not exist)
    const rm = RoomManager.get(payload.channel);
    rm.push(connection.id);
    console.log('----------------GAME SOCKET ENTER-------------');
    console.log(payload.channel);
    console.log(rm);
    connection.data.channel = payload.channel;

    helper.emit(connection, helper.createAction(SEND.SUCCESS.ENTER, {
        userList: []
    }));
  },

  auth: async (connection, payload) => {
    const rm = RoomManager.get(connection.data.payload);

    const account = await User.findById(payload.sessionID);        
    if (!account) {
        // username not found
        return helper.emit(connection, error(2, RECEIVE.AUTH));
    }

    // account is valid
    const username1 = account.displayName;
    connection.data.username = username1;
    connection.data.userId = account._id;
    // connection.data.anonymous = false;

    connection.data.sessionID = payload.sessionID;
    connection.data.valid = true;
    rm.validate(connection.id);

    helper.emit(connection, helper.createAction(SEND.SUCCESS.AUTH, {username: connection.data.username}));

    // handles multiple window
    if (rm.countUser(connection.data.username) !== 1) {
      return;
    }

    // broadcast that user has joined
/*    
    rm.broadcast(helper.createAction(SEND.JOIN, {
      anonymous: connection.data.anonymous,
      username: connection.data.username,
      date: (new Date()).getTime(),
      suID: helper.generateUID()
    }));
*/
  },
  deposit: async (connection, payload) => {
    // check session validity
    if(!connection.data.valid) {
      return helper.emit(connection, error(1, RECEIVE.MSG));
    }

    const rm = RoomManager.get(connection.data.channel);

    const gameId = connection.data.channel;
    const game = GameEngine.get(gameId);

    if(game === null){
      //error
      return;
    }
    
    try {
      const newBal = await game.deposit(connection.data.userId, payload.amount);
      helper.emit(connection, helper.createAction(SEND.SUCCESS.DEPOSIT, {
        newBal: 0
      }));
    } catch ( e ) {
      console.log(e);
      return;
    }

    rm.broadcast(helper.createAction(SEND.DEPOSIT, {
      username: connection.data.username,
      amount: payload.amount,
    }), connection);

  },
}

const packetHandler = (connection, packet) => {
  
  // process packet
  console.log(`packetHandler data:${packet}`);

  const o = helper.tryParseJSON(packet);

  if(!o) {
    return helper.emit(connection, error(0));
  }

  switch(o.type) {
    case RECEIVE.ENTER:
      console.log('enter recieved');
      game.enter(connection, o.payload);
      break;
    case RECEIVE.AUTH:
      game.auth(connection, o.payload);
      break;
    case RECEIVE.DEPOSIT:
      game.deposit(connection, o.payload);
      break;
    default:
      helper.emit(connection, error(0));
      break;
  }

}

export default packetHandler;