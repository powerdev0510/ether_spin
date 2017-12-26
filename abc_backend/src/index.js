import dotenv from 'dotenv';
dotenv.config(); // LOAD CONFIG

// console.log('env file initialized....');
import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';

import echo from './echo';
import bodyParser from 'koa-bodyparser';

// import db from './db';


// db connect
const db = require('./db');
db.connect();

// create app for koa
const app = new Koa();
const router = new Router();

// CORS
app.use((ctx, next) => {
  const allowedHosts = [
    'bitimulate.com',
    's3.bitimulate.com.s3-website.ap-northeast-2.amazonaws.com',
    'localhost'
  ];
  const origin = ctx.header['origin'];
  allowedHosts.every(el => {
    if(!origin) return false;
    if(origin.indexOf(el) !== -1) {
      ctx.response.set('Access-Control-Allow-Origin', origin);
      return false;
    }
    return true;
  });
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-timebase, Link');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
  ctx.set('Access-Control-Expose-Headers', 'Link');
  return next();
});

/* SETUP MIDDLEWARE */
// var bodyParser = require('koa-bodyparser');
app.use(bodyParser()); //parse json

// set route for api
const api = require('./api');
router.use('/api', api.routes());
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;

var server = http.createServer(app.callback());
echo.installHandlers(server, { prefix: '/echo' });

server.listen(port, () => {
    console.log(`ABC is listening to port ${port}`);
  });