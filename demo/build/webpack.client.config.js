const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const glob = require('glob')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')


const config = merge(base, {
    entry: {
        app: './src/client-entry.js'
    },
    resolve: {
        alias: {
            'create-api': './create-api-client.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
            'process.env.DEBUG_API': '"true"'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return (
                    /node_modules/.test(module.context) && !/\.css$/.test(module.require)
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new VueSSRClientPlugin()
    ]
})
if (process.env.NODE_ENV === 'production'){
    const srcDir = path.resolve(__dirname, '../').replace(/\\/g, "\/")
    prefixMulti = {
        [srcDir]: ''
    }
    config.plugins.push(
        new SWPrecachePlugin({
            cacheId: 'vue-ssr',
            filename: 'service-worker.js',
            stripPrefixMulti: prefixMulti,
            dontCacheBustUrlsMatching: /./,
            /* dynamicUrlToDependencies: {
                '/': glob.sync('./dist/*.js'),
                '/top': glob.sync('./dist/*.js')
            }, */
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
            runtimeCaching: [
                {
                    urlPattern: '/',
                    handler: 'networkFirst'
                },
                {
                    urlPattern: /\/(top|new)/,
                    handler: 'networkFirst'
                }
            ]
        })
    )
}
module.exports = config
