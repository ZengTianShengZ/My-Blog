本篇介绍koa2的使用，并一步步搭建一套后端服务

涉及到的功能点有

+ koa2基础应用
+ koa2-router 使用
+ 简单的get、post请求
+ 怎么写一个koa2中间件
+ 接入 mongodb
+ 项目框架搭建
+ 使用pm2管理node进程
+ 部署线上操作

## 一、koa2 基础应用

1、hello word

```javascrip
// index.js
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {
  ctx.body = 'hello koa2'
})

app.listen(3000)
console.log('start-quick is starting http://localhost:3000/')

```

启动demo
```

node index.js
```
浏览器打开连接 `http://localhost:3000/` 能看到输出 `hello koa2`

2、koa ctx 

也许你会注意到上面 demo 的 ctx 是个什么，ctx.body 为什么能返回请求数据，我们试着 `console.log(ctx)`

```
{ request:
   { method: 'GET',
     url: '/',
     header:
      { host: 'localhost:3000',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'max-age=0',
        cookie: '2%22%7D',
        'proxy-connection': 'keep-alive',
        'upgrade-insecure-requests': '1',
        'x-lantern-version': '4.7.0' } },
  response: { status: 404, message: 'Not Found', header: {} },
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  originalUrl: '/',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>' }
{ request:
   { method: 'GET',
     url: '/favicon.ico',
     header:
      { host: 'localhost:3000',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        cookie: '2%22%7D',
        pragma: 'no-cache',
        'proxy-connection': 'keep-alive',
        referer: 'http://localhost:3000/',
        'x-lantern-version': '4.7.0' } },
  response: { status: 404, message: 'Not Found', header: {} },
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  originalUrl: '/favicon.ico',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>' }
```

可以看到 ctx 封装了一些 request 和 response 信息，这里的 ctx 其实就是对应 Koa Context  ，Koa Context 将 node 的 request 和 response 对象封装到这个对象中，可以看下面的一张对照表

```
ctx -> Koa Context // koa 启动时生成的上线下文
ctx.req -> 原生 Node 的 request 对象
ctx.res -> 原生 Node 的 response 对象
ctx.request -> koa 的 Request 对象.
ctx.response -> koa 的 Response 对象.
```

弄懂了 ctx ,接着咱们再来讨论 ctx.body , 上面不是讲了 ctx 是封装了 request 和 response 信息，ctx.body 是哪里来的，其实 koa 内部对 ctx 多做了一层 delegate （委托），`ctx.body = ctx.response.body`, 这样做的好处是啥，方便使用啊，代码也简洁。具体源码可查看 [koa context.js 160行](https://github.com/koajs/koa/blob/master/lib/context.js)
同样的委托处理还有：

```
// Request 别名
ctx.header
ctx.headers
ctx.method
ctx.method=
ctx.url
ctx.path=
ctx.query
// ...
```

```
// Response 别名
ctx.body
ctx.body=
ctx.status
// ...
```

## 二、koa 路由

### 1、原生路由
我们有多个页面就有多个路由，也存在多个请求接口 get post 请求等，怎么来处理不同路由的请求呢，哈哈，其实很简单，应用到上面的知识点，我们能通过 ctx.request.url 拿到请求路径， switch 一下请求路径对不同的路由做区别处理不就行了。

```
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {
  console.log(ctx.url);
  const url = ctx.url
  switch ( url ) {
    case '/':
      ctx.body = 'hello koa2 '
      break
    case '/page2':
      ctx.body = 'hello koa2 page2'
      break
    case '/404':
      ctx.body = 'hello koa2 404'
      break
    default:
      break
  }
})

app.listen(3000)
console.log('start-quick is starting http://localhost:3000/')
```

浏览器分别访问

```
http://localhost:3000/
http://localhost:3000/page2
http://localhost:3000/404
```
能看到不同的页面信息

### 2、接收 get post 请求

原生路由怎么处理 get post 请求呢，可以通过 ctx.method 拿到请求类型, ctx.query 可以拿到请求数据，但 post请求 koa 没封装取参的方法，需要自己通过原生的 node request 进行处理， ctx.req 对象对应的就是 node request 上面提到过了

```
app.use( async ( ctx ) => {
  if (ctx.method === 'GET') {
    ctx.body = {
      msg: '这是一个post请求',
      data: ctx.query // get 请求数据
    }
  }
  if (ctx.method === 'POST') {
    ctx.body = {
      msg: '这是一个post请求',
      data: parsePostData(ctx) // post 请求数据
    }
  }  
})

// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        let parseData = parseQueryStr( postdata )
        resolve( parseData )
      })
    } catch ( err ) {
      reject(err)
    }
  })
}
```

### 3、koa-router中间件

有没有发现万一工程一复杂，咱们自己处理原生的路由就比较麻烦，也很低效。咱们可以将这些麻烦的路由处理交给第三方中间件 koa-router中间件 来处理，中间件的概念下文做介绍，你只要先知道这个 npm 包引进来就可以踢咱们处理路由就行了。并且我们还用了一个 koa-bodyparser中间件 来处理 post 请求解析请求参数

```
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

// 使用ctx.body解析中间件
app.use(bodyParser())

router.get('/', async (ctx) => {
  ctx.body = 'hello koa-router'
})

router.post('/', async (ctx) => {
  // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
  const postData = ctx.request.body
  ctx.body = {
    postData
  }
})

app.use(router.routes())

app.listen(3000)
console.log('start-quick is starting http://localhost:3000/')
```

## 三、koa 中间件

上面有提到中间件的概念，那中间件是什么呢，中间件也可以看成是过滤器，就好比水管管道，中间件就是管道上的阀门，水流过管道要经过一个或几个阀门的处理。有了中间件咱们就可以对数据的请求和响应多更多的处理了。下面咱们来写一个一个简单的 log 中间件

```
const app = new Koa()

async function logMiddleware(ctx, next) {
  console.log('url: %s , method: %s', ctx.url, ctx.method )
  await next()
}
// 引入中间件
app.use(logMiddleware)
app.use(async (ctx) => {
  ctx.body = 'hello logMiddleware'
})
```

可看到页面输出 'hello logMiddleware' 同时控制台也打印出了 log 信息。
koa 中间件是一个 Promise 的方法 async fn(ctx, next), ctx 代表上下文，执行 next() 会进入下一个中间件，koa 的中间件的特征会被比喻成【洋葱模型】

 [](img)

koa 其实内部从接收到请求，到输出响应的伪代码大概如下，都是一个个中间件去处理的

```
new Promise(function(resolve, reject) {
  // 我是中间件1
  yield new Promise(function(resolve, reject) {
    // 我是中间件2
    yield new Promise(function(resolve, reject) {
      // 我是中间件3
      yield new Promise(function(resolve, reject) {
        // 我是body
      });
      // 我是中间件3
    });
    // 我是中间件2
  });
  // 我是中间件1
});
``` 

## 四、项目框架搭建

有了以上的知识储备咱们就可以开始进行一个后端服务的搭建了，是的，实践出真知，我们不一定要准备好所有的知识点才开始服务的搭建，node的知识还很多，koa2 也不单单就上面说的那么点知识，但咱们目的是搭建一套后端服务，有了一套整体框架的概念再到实际项目开发中去补缺补漏，完善知识体系，这是我认为比较快速的一套学习方法。



