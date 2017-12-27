
const Router = require('koa-router');
const auth = require('./auth');
const chat = require('./chat');
// const user = require('./user');

const api = new Router();

api.use('/auth', auth.routes());
api.use('/chat', chat.routes());
// api.use('/user', user.routes());

module.exports = api;