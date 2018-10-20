本篇介绍koa2的使用，并一步步搭建一套后端服务

涉及到的功能点有

- [x] koa2基础应用
- [x] koa 路由
  - [x] 原生路由
  - [x] 接收 get/post 请求
  - [x] koa-router中间件
- [x] koa 中间件  
- [x] 项目框架搭建
- [x] 进程管理工具PM2
- [x] 部署线上

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

可以看到 ctx 封装了一些 request 和 response 信息，这里的 ctx 其实就是对应 koa Context  ，koa Context 将 node 的 request 和 response 对象封装到这个对象中，可以看下面的一张对照表

```
ctx -> Koa Context // koa 启动时生成的上下文
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
我们实际项目中存在多个路由，也存在多个请求接口 get/ post 请求等，怎么来处理不同路由的请求呢，其实很简单，应用到上面的知识点，我们能通过 ctx.request.url 拿到请求路径， switch一下请求路径对不同的路由做区分处理不就行了。

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

### 2、接收 get/post 请求

原生路由怎么处理 get/post 请求呢，可以通过 ctx.method 拿到请求类型, ctx.query 可以拿到请求数据，但 post请求 koa 没封装取参的方法，需要自己通过原生的 node request 进行处理， ctx.req 对象对应的就是 node request ,前文有提到过了

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

有没有发现万一工程一复杂，咱们自己处理原生的路由就比较麻烦，也很低效。咱们可以将这些麻烦的路由处理交给第三方中间件 `koa-router` 中间件 来处理，中间件的概念下文做介绍，你只要先知道这个 npm 包引进来就可以替咱们处理路由就行了。并且我们还用了一个 `koa-bodyparser ` 中间件来处理 post 请求解析请求参数

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

上面有提到中间件的概念，那中间件是什么呢，中间件也可以看成是过滤器，就好比水管管道，中间件就是管道上的阀门，水流过管道要经过一个或几个阀门的处理。有了中间件咱们就可以对数据的请求和响应做更多的处理了。下面咱们来写一个简单的 log 中间件

```
const app = new Koa()

async function logMiddleware(ctx, next) {
  console.log('url: %s , method: %s', ctx.url, ctx.method )
  await next()
}
//引入中间件
app.use(logMiddleware)
app.use(async (ctx) => {
  ctx.body = 'hello logMiddleware'
})
```

可看到页面输出 'hello logMiddleware' ，同时控制台也打印出了 log 信息。
koa 中间件是一个 Promise 方法 ` async fn(ctx, next)`, ctx 代表上下文，执行 next() 会进入下一个中间件，koa 的中间件的特征会被比喻成【洋葱模型】

![clipboard.png](https://raw.githubusercontent.com/ZengTianShengZ/My-Blog/master/koa2%E6%90%AD%E5%BB%BA%E5%90%8E%E5%8F%B0%E5%BA%94%E7%94%A8/image/img1.png)

koa 其实内部从接收请求，到输出响应的伪代码大概如下，都是由一个个中间件处理的

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

有了以上的知识储备咱们就可以开始进行一个后端服务的搭建了。是的，实践出真知，我们不一定要准备好所有的知识点才开始服务的搭建，node的知识还很多，koa2 也不单单就上面说的那么点知识，但咱们可以通过搭建一套后端服务，有了一套整体框架的概念再到实际项目开发中去补缺补漏，完善知识体系，这是我认为比较快速的一套学习方法。

项目目录结构：

```
 demo
  |-- controller            // 控制层
  |-- middleware            // 中间件
  |-- model                 // 数据层
  |-- mongodb               // mongodb
  |-- router                // 路由
  |    |-- index.js         // 主路由
  |    |-- user.js          // 用户路由
  |-- app.js                // 主入口
  |-- config.js             // 配置文件
  |-- ecosystem.config.js   // pm2 启动文件
  |-- start.js              // 入口
```

具体源码可以 cd /koa2搭建后台应用/demo/ 查看，我下面拆出几个模块来讲

> start.js 

入口文件引入了 babel 使得我们的项目可以使用 es6 的语法

```
require('babel-core/register')();
require('babel-polyfill');
require('./app.js');
```

> app.js

app.js 添加了一些中间件和路由，并监听了 config.port 端口

```
const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(errorMiddleware());

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`);
});
```

> module/user.js

数据库我们选取 MongoDB，并用了 mongoose 这个 npm 包来配合我们做数据库操作，关于 mongoose 的用法不清楚的同学可以查看官方文档或 [这一篇博文](http://ourjs.com/detail/53ad24edb984bb4659000013)

下面是我们对 user 集合（这里不应该叫做表，而是集合）的设计

```
const userSchema = new Schema({
    openId: String,
    nickName: String,
    avatarUrl: {type: String, default: 'http://oyn5he3v2.bkt.clouddn.com/none_aux.png'},
    gender: {type: Number, default: 1}, // 默认男
    province: String,
    city: String,
    country: String,
}, {timestamps: true})
```

> controller/user.js

最关心的应该是控制层的设计了，控制层对接了我们接口的处理和数据库的操作

下面的控制层对应两个路由
```
router.get('/login/:openId', userController.getUser);
router.post('/createUser', userController.createtUser);
```

```
export const getUser = async (ctx) => {
  const {openId} = ctx.params
  if (!openId) {
    ctx.body =  _errData('openId 参数不存在')
    return
  }
  try {
    const resData = await userModel._findOpenId(openId)
    if (resData) {
      ctx.body = _successData(resData)
    } else {
      ctx.body =  _errData('用户不存在', 4000)
    }
  } catch (err) {
    console.log(err)
    ctx.body =  _errData()
  }
}

export const createtUser = async (ctx) => {
  const data = ctx.request.body
  const resData = await userModel._create(data)
  if (resData.openId) {
    ctx.body = _successData(resData)
  } else {
    ctx.body =  _errData('用户创建失败', 4000)
  }
}
```

一个 get 请求，一个 post 请求，做一些操作数据库和返回数据的业务操作。
细心的你肯能会发现 `getUser` 方法 有做 try catch 处理，而 `createtUser` 方法没有做此处理，这里只是给大家表现出差异，其实我们在 app.js 引入了个中间件 `errorMiddleware` 做了统一的 try catch 处理


> middleware/index.js

这里写了个 errorMiddleware 中间件，对整个项目的异常做 try catch 处理，当然你还可以添加自己需要的中间件

```
export function errorMiddleware () {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err)
      ctx.body = {
        msg: '服务器错误',
        code: 5000,
        success: false,
      }
    }
  };
};

// 主入口程序使用中间件
// app.use(logMiddleware)
```

> config.js

config.js 做了一些环境配置，我们需要区分开发环境和线上环境，有可能需要配置不一样的端口，或者数据库等，可以在这份配置文件做配置

```
const common = {
  mongodb: 'mongodb://localhost:27017/demo'
}

const development = Object.assign(common ,{
  port: 3000,
  mongodb: 'mongodb://localhost:27017/development'
})

const production = Object.assign(common ,{
  port: 3001,
  mongodb: 'mongodb://localhost:27017/production'
})

let config

process.env.NODE_ENV === 'production' ? config = production : config = development

export default config
```

## 五、进程管理工具

上面的工程是搭建完了，但发现我们的工程开发效率实在太低了，特别是调试bug的时候，我们需要写完调试代码重启一下服务，费时费力。这里介绍个草鸡好用node进程管理工具 `pm2` 。

下面是一份 pm2 的配置清单：
主要的是我们配置了 log 日志输出，并且在开发模式下我们启动了 watch 模式，这样在开发过程中不用频繁的重启服务了，再者就是我们区分了3个不同的环境 development 、 testing 、production。如果需要自己配置或修改清单可以参考网上的一些资料 [pm2 gitbook](https://wohugb.gitbooks.io/pm2/content/index.html)

```
apps : [
    {
      name: 'koa2-demo',
      script: 'start.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'server_logs/err.log',
      exec_mode: "cluster",
      out_file: 'server_logs/out.log',
      max_memory_restart: '600M', // 限制最大内存
      min_uptime: '200s', // 应用运行少于时间被认为是异常启动, 防止不断重启
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_development: {
        name: 'koa2-demo-development',
        NODE_ENV: 'development',
        watch: 'true'
      },
      env_testing: {
        name: 'koa2-demo-testing',
        NODE_ENV: 'testing'
      },
      env_production : {
        name: 'koa2-demo-production',
        NODE_ENV: 'production'
      }
    }
  ]
```

接着配合 package.json 的 scripts 命令我们就可以这样启动 node 应用了

```
npm run server-dev
npm run server-test
npm run server-prod
```

## 六、部署线上

线上部署也是用到 pm2 来启动启动 node 应用，将工程打个压缩包上传到服务器，解压一下，pm2 启动

```
npm run server-test
npm run server-prod
```

别忘了需要先启动服务端的 MongoDB，好需要配个 nginx 来转发我们 node 服务的端口,下面给出一份简单的 nginx 配置

```
server {
    listen       80;
    server_name  api.example.com;

    location ^~/api/ {
       proxy_pass http://127.0.0.1:3001/;
    }
}
```

## 总结：

我们从介绍 koa ，到最后搭建一套简单的 node 后端服务，包括上线和部署，形成一套 node 服务体系。在这过程中我们涉及到了 mongodb 、 pm2 、nginx 配置等一下基本的后端知识体系做支撑。

当然我们学习到的只是一些应用知识，需要在不断在实践和工作中去完善知识体系
