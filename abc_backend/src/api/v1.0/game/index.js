
const Router = require('koa-router');

const game = new Router();
const gameCtrl = require('./game.ctrl');
const needAuth = require('lib/middlewares/needAuth');

game.get('/', (ctx) => {
  ctx.body = {
    message: 'ok'
  };
});

game.get('/find/type/:type', gameCtrl.findGame);
game.get('/create/type/:type', needAuth, gameCtrl.createGame);
game.post('/deposit', needAuth, gameCtrl.deposit);
game.get('/id/:id', gameCtrl.getGameData);

// auth.get('/exists/email/:email', authCtrl.checkEmail);
// auth.get('/exists/display-name/', authCtrl.checkDisplayName);

module.exports = game;