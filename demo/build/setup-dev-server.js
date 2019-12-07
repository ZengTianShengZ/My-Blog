/**
 * @description: 启动 server 热更新
 * @author: zengtiansheng
 * @update: 2018/3/2
 */
const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')
const { koaDevMiddleware, koaHotMiddleware } = require('koa-webpack-middleware-zm')

module.exports = function setupDevServer (app, cb) {
    let bundle
    let clientManifest
    let resolve
    let resolved = false
    // 将 Promise 的 resolve 外置执行，让代码更简洁吧
    const readyPromise = new Promise(r => { resolve = r })
    const ready = (...args) => {
        resolve()
        cb(...args)
    }

    clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
    clientConfig.output.filename = '[name].js'
    clientConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )

    // dev middlemare
    // 客户端
    const clientCompiler = webpack(clientConfig)
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        }
    })
    app.use(koaDevMiddleware(devMiddleware))
    clientCompiler.plugin('done', (stats) => {
        const fs = devMiddleware.fileSystem
        console.log('!>watch')
        if (stats && stats.compilation && (stats.compilation.errors || stats.compilation.warnings) && (stats.compilation.errors.length > 0 || stats.compilation.warnings.length > 0)) {
            console.log(require('format-webpack-stats-errors-warnings')(stats, path.resolve(__dirname, '../')))
        }
        console.log('!>compiler')
        const readFile = file => fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
        clientManifest = JSON.parse(readFile('vue-ssr-client-manifest.json'))
        if (bundle) {
            ready(bundle, { clientManifest })
        }
    })
    const expressHotMiddleware = require('webpack-hot-middleware')(clientCompiler)
    app.use(koaHotMiddleware(expressHotMiddleware))

    // 服务端
    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        const readFile = file => mfs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
        bundle = JSON.parse(readFile('vue-ssr-server-bundle.json'))
        if (clientManifest) {
            ready(bundle, { clientManifest })
        }
    })
    return readyPromise
}
