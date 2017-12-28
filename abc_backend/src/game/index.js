import sockjs from 'sockjs';
import RoomManager from './room';
import sockets, { connect, disconnect } from './sockets';

const options = { sockjs_url: 'https://cdn.jsdelivr.net/sockjs/1.1.1/sockjs.min.js' };
const echo = sockjs.createServer(options);

// intialize room
RoomManager(sockets);

echo.on('connection', function(conn) {
    console.log(conn);
    connect(conn);
    conn.on('data', function(data) {
        console.log('game data received');
        console.log(data);
    });
    conn.on('close', function() {
      console.log('[GAME] close event');
      disconnect(conn);
    });
});

export default echo;
