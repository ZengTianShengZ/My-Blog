const Koa = require('koa2')
const path = require('path')
const static = require('koa-static')
const Router = require('koa-router')
const { uploadFile } = require('./upload')

const app = new Koa()
// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

app.use(static(
    path.join( __dirname,  staticPath)
))

const upload = new Router()

upload.get('/test', async (ctx) => {
    ctx.body = 'test get'
})

upload.post('/uploadFile', async (ctx) => {
    // 上传文件请求处理
    let result = { success: false }
    const serverFilePath = path.join( __dirname, 'upload-files' )
    // 上传文件事件
    result = await uploadFile( ctx, {
      fileType: 'album',
      path: serverFilePath
    })
    ctx.body = result
})

// 装载所有子路由
const router = new Router()
router.use('/api', upload.routes(), upload.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.use( async ( ctx ) => {
    ctx.body = `<h1>404 not find</h1>`
})

//
// app.use( async ( ctx ) => {
//
//   if ( ctx.url === '/' && ctx.method === 'GET' ) {
//     // 当GET请求时候返回表单页面
//     let html = `
//       <h1>koa2 upload demo</h1>
//       <form method="POST" action="/upload.json" enctype="multipart/form-data">
//         <p>file upload</p>
//         <span>picName:</span><input name="picName" type="text" /><br/>
//         <input name="file" type="file" /><br/><br/>
//         <button type="submit">submit</button>
//       </form>
//     `
//     ctx.body = html
//
//   } else if ( ctx.url === '/upload.json' && ctx.method === 'POST' ) {
//     // 上传文件请求处理
//     let result = { success: false }
//     let serverFilePath = path.join( __dirname, 'upload-files' )
//
//     // 上传文件事件
//     result = await uploadFile( ctx, {
//       fileType: 'album',
//       path: serverFilePath
//     })
//
//     ctx.body = result
//   } else {
//     // 其他请求显示404
//     ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
//   }
// })

app.listen(3000, () => {
  console.log('[demo] upload-simple is starting at port 3000')
})

// 理解HTTP之Content-Type
// http://homeway.me/2015/07/19/understand-http-about-content-type/

// koa2 
// https://chenshenhai.github.io/koa2-note/

// file 属性
//http://www.cnblogs.com/zichi/p/html5-file-api.html