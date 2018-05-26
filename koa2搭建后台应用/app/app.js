import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './router'
import {errorMiddleware} from './middleware'
import config from './config'

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(errorMiddleware());

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`);
});