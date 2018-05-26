const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

async function logMiddleware(ctx, next) {
  console.log('url: %s , method: %s', ctx.url, ctx.method )
  await next()
}
app.use(logMiddleware)
app.use(async (ctx) => {
  ctx.body = 'hello logMiddleware'
})

app.listen(3000)
console.log('start-quick is starting http://localhost:3000/')
