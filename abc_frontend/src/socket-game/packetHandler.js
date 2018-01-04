import * as helper from './helper';
import { log } from './helper';
import {client as SEND, server as RECEIVE} from './packetTypes';
import notify from 'helpers/notify';
import store from 'store';
import * as gameActions from 'store/modules/game';

const updateGame = (payload) => {
  store.dispatch(gameActions.updateGameData(payload));
}

const service = {
  success: {
    enter: (packet) => {
      log('RECEIVE ENTER_SUCCESS');
      notify({type: 'success', message: '[GAME] RECEIVE ENTER_SUCCESS'});
    },
    auth: (packet) => {
      log('RECEIVE AUTH_SUCCESS');
      notify({type: 'success', message: '[GAME] RECEIVE AUTH_SUCCESS'});
    }
  },

  error: (packet) => {
    switch (packet.payload.code) {
      default:
        log('RECEIVE ERROR');
        notify({type: 'success', message: '[GAME] RECEIVE ERROR'});
    }
  },

  gameData: (packet) => {
    log('RECEIVE UPDATED GAME DATA');
    notify({type: 'success', message: '[GAME] RECEIVE UPDATED GAME DATA'});
    if( packet && packet.payload )
    updateGame(packet.payload);
  }

}

export default function packetHandler(packet) {
  const o = helper.tryParseJSON(packet);

  if (!o) {
    return console.error('[GAME-SOCKET] Received invalid response from server');
  }

  switch (o.type) {
    case RECEIVE.SUCCESS.ENTER:
      service.success.enter(o);
      break;
    case RECEIVE.SUCCESS.AUTH:
      service.success.auth(o);
      break;
    case RECEIVE.ERROR:
      service.error(o);
      break;
    case RECEIVE.GAMEDATA:
      service.gameData(o);
      break;
    default:
      break;
  }
}