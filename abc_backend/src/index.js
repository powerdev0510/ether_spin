import Koa from 'koa';
import Router from 'koa-router';
import dotenv from 'dotenv';

dotenv.config(); // LOAD CONFIG

// create app for koa
const app = new Koa();
const router = new Router();

// set route for api
// router.use('/api', api.routes());
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;

// listen
app.listen(port, () => {
  console.log(`ABC is listening to port ${port}`);
});
