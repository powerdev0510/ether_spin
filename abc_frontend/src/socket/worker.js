
import { store } from 'store';
import * as chatAction from 'store/modules/chat';

let packets = [];

let workDelay = 50;

let timeoutId = null;

async function work() {
  if (packets.length > 0) {
    store.dispatch(chatAction.receiveRealtimeData(packets));
    packets = [];
  }

  timeoutId = setTimeout(work, workDelay);
}

const worker = {
  start: () => {
    work();
  },

  stop: () => {
    clearTimeout(timeoutId);
  },

  assign: (packet) => {
    packets.push(packet);
  }
};

export default worker;