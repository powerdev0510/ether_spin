import { log } from 'echo/helper';
import _ from 'lodash';
import RoomManager from './room';

let counter = 0;
let freeSlot = [];
const sockets = {};

// tells valid socket lengths
function getSocketsLength() {
  return Object
      .keys(sockets)
      .length - freeSlot.length;
}

// register new connection
export function connect(connection) {
  // if there is a free slot, assign if not, create a new slot
  const freeId = freeSlot.shift();
  if (freeId) {
      connection.id = freeId;
  } else {
      connection.id = ++counter;
  }

  // store connection in sockets
  sockets[connection.id] = connection;
  connection.data = {
    username: null,
    channel: null,
    sessionId: null,
    valid: false,
    counter: 0
  };

  log(`Socket ${connection.id} Connected - ${getSocketsLength()}`);
}

// unregister lost connection
export function disconnect(connection) { 
  // const room = RoomManager.get(connection.data.channel);
  // if(room) {
  //   room.remove(connection.id);

    // if (connection.data.valid) {
    //   if (!ch.countUser(connection.data.username)) {
    //       ch.broadcast(helper.createAction(SEND.LEAVE, {
    //           date: (new Date()).getTime(),
    //           suID: helper.generateUID(),
    //           username: connection.data.username,
    //           anonymous: connection.data.anonymous
    //       }));
    //   }
    // }
  // }

  _.remove(sockets, (socket) => {
    return connection.id === socket.id
  });

  freeSlot.push(connection.id);
  log(`Socket ${connection.id} Disconnected - ${getSocketsLength()}`);
}

export default sockets;