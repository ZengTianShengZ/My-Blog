/**
 * @description: 文件或模块描述
 * @author: zengtiansheng
 * @update: 2018/3/2
 */
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const KoaRuoter = require('koa-router')
const serve = require('koa-static')
const { createBundleRenderer } = require('vue-server-renderer')
const LRU = require('lru-cache')

const resolve = file => path.resolve(__dirname, file)
const app = new Koa()
const router = new KoaRuoter()
const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8')

function createRenderer (bundle, options) {
    return createBundleRenderer(
        bundle,
        Object.assign(options, {
            template,
            cache: LRU({
                max: 1000,
                maxAge: 1000 * 60 * 15
            }),
            basedir: resolve('./dist'),
            runInNewContext: false
        })
    )
}

let renderer
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
renderer = createRenderer(bundle, {
    clientManifest
})

/**
 * 渲染函数
 * @param ctx
 * @param next
 * @returns {Promise}
 */
function render (ctx, next) {
    ctx.set("Content-Type", "text/html")
    return new Promise (function (resolve, reject) {
        const handleError = err => {
            if (err && err.code === 404) {
                ctx.status = 404
                ctx.body = '404 | Page Not Found'
            } else {
                ctx.status = 500
                ctx.body = '500 | Internal Server Error'
                console.error(`error during render : ${ctx.url}`)
                console.error(err.stack)
            }
            resolve()
        }
        const context = {
            title: 'Vue Ssr 2.3',
            url: ctx.url
        }
        console.log(ctx.url)
        renderer.renderToString(context, (err, html) => {
            if (err) {
                return handleError(err)
            }
            console.log(html)
            ctx.body = html
            resolve()
        })
    })
}

// app.use(serve('/dist', './dist', true))
// app.use(serve('/public', './public', true))
app.use(serve(__dirname + '/dist'))

router.get('*', render)
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 8089
app.listen(port, '0.0.0.0', () => {
    console.log(`server started at localhost:${port}`)
})



