
import _ from 'lodash';
import {log} from 'echo/helper';

const rooms = {};

let sockets = null;

function emit(connection ,data) {
  connection.write(JSON.stringify(data));
}

function Room(name) {
  this.name = name;
  this.users = []; // stores userId
  this.usernames = {}; // stores username
  this.sleep = true;
  this.timeout = null;
  this.killChannelTimeout = null;

  // add userId
  this.push = (userId) => {
    this.users.push(userId);
    if(this.killChannelTimeout) {
      clearTimeout(this.killChannelTimeout);
      this.killChannelTimeout = null; // revive
    }

    console.log(this.users);
  }

  this.validate = (userId) => {
    if(!this.usernames[sockets[userId].data.username]) {
      this.username[sockets[userId].data.username] = 1;
    } else {
      this.usernames[sockets[userId].data.username]++;
    }
  }

  // removes userId
  this.remove = (userId) => {
    if(sockets[userId].data.valid) {
      if(this.usernames[sockets[userId].data.username] !== 1) {
        this.usernames[sockets[userId].data.username]--;
      } else {
        delete this.usernames[sockets[userId].data.username];
      }
    }

    _.remove(this.users, n => {
      return n === userId;
    });

    if(this.users.length === 0) {
      room.remove(this.name);
    }
  };

  //broadcast the data to this Channel
  this.broadcast = async (data, connection) => {
    console.log('<==============>[broadcast]<===================>');
    console.log(this.users.length);
    for (let i = 0; i < this.users.length; i ++) {
      emit(sockets[this.users[i]], data);
    }

/*
    // store data to db 
    if(data.type !== "DEPOSIT") {
      return;
    }

    if(this.sleep === true) {
      log('Channel ' + this.name + ' is awake');
      this.sleep = false;
      clearTimeout(this.timeout);

      this.timeout = setTimeout(
        () => {
          log('Channel ' + this.name + ' is sleeping');
          this.sleep = true;

          // Message.write({
          //   suID: generateUID(),
          //   type: "SLEEP",
          //   channel: this.name
          // });
        }, 1000 * 60 * 60 // 1 hour
      );
    }
*/
  }

  this.countUser = (username) => {
    return this.usernames[username];
  }

  this.getUserList = () => {
    const usernames = Object.keys(this.usernames);

    // find the socket by username
    // then identify whether it is anyonymous user
    const users = [...this.users];

    const userList = usernames.map(
      (username) => {
        for(var i = 0; i < users.length; i ++) {
          var userId = users[i];
          if(sockets[userId].data.username === username) {
            users.splice(i,1);
            return {
              username,
              anonymous: sockets[userId].data.anonymous
            }
          }
        }
      }
    );

    return userList; 
  }

}
function room(_sockets) {
  sockets = _sockets;
}

room.create = async (name) => {
  rooms[name] = new Room(name);
  // rooms[name].channelId = 'all';
  return true;
}

room.remove = (name) => {
  //kill channel when there is no new user within 1 minutes.
  rooms[name].killChannelTimeout = setTimeout(
    () => {
      clearTimeout(rooms[name].timeout);

      // db log
      delete rooms[name];
      log(name + ' room is dying..');
      log(Object.keys(rooms).length + ' rooms alive');
    }, 1000 * 60
  );
}

room.get = (name) => {
  if(!rooms[name]) {
    //create one if not existing
    room.create(name);
  }

  return rooms[name];
}


export default room;
