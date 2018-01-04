import readline from 'readline';
import SockJS from 'sockjs-client';
import {client as SEND} from './packetTypes';
let intervalId = null;
let socket = null;


const rl = readline.createInterface({input: process.stdin, output: process.stdout})

function ask(question) {
    return new Promise((resolve) => {
        rl.question("[CLIENT] " + question + '\n', (answer) => {
            resolve(answer)
        })
    });
}

// creates action object
function send(data) {
  socket.send(JSON.stringify(data));
}

// creates action object
function createAction(type, payload) {
    return {type, payload};
}

async function start() {
    let channel = await ask("Channel?");
    send(createAction(SEND.ENTER, {channel}));

    // const sessionID = (new Date()).toString(); //"dHkxl0zudajC19164Yqx2lQTJC94LEcN";

    // let anonymous = await ask("Anonymous? y/n");
    // if(anonymous === 'y') {
    //     send(createAction(SEND.AUTH, {
    //         sessionID,
    //         anonymous: true
    //     }));
    // }
}

const initConnection = () => {
  socket = new SockJS("http://localhost:8080/game");
  clearInterval(intervalId);
  socket.onopen = function () {
      console.log('connected');
      start();
  };
  socket.onmessage = function (e) {
      console.log('message received.');
      console.log(e.data);
  };
  socket.onclose = function () {
      socket = null;
      console.log("disconnected, reconnecting..")
      intervalId = setInterval(function () {
          initConnection();
      }, 2000);
  };
}

initConnection();

rl.setPrompt('');
rl.prompt();

rl.on('line', function (line) {
  send({type:'GAME', payload:{message: line}});
  
  rl.prompt();
})
  .on('close', function () {
      console.log('Have a great day!');
      process.exit(0);
  });