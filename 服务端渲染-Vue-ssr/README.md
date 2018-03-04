## 服务端渲染（SSR）
什么是服务端渲染，简单理解是将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。
于传统的SPA（单页应用）相比，服务端渲染能更好的有利于SEO，减少页面首屏加载时间，当然对开发来讲我们就不得不多学一些知识来支持服务端渲染。同时服务端渲染对服务器的压力也是相对较大的，和服务器简单输出静态文件相比，通过node去渲染出页面在传递给客户端显然开销是比较大的，需要注意准备好相应的服务器负载。

### 一、一个简单的例子

```javascript
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello World</div>`
})
// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()
// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})
```
上面例子利用 `vue-server-renderer` npm 包将一个vue示例最后渲染出了一段 html。将这段html发送给客户端就轻松的实现了服务器渲染了。

```javascript
const server = require('express')()
server.get('*', (req, res) => {
  // ... 生成 html
  res.end(html)
})
server.listen(8080)
```

### 二、官方渲染步骤

上面例子虽然简单，但在实际项目中往往还需要考虑到路由，数据，组件化等等，所以服务端渲染不是只用一个 `vue-server-renderer` npm就能轻松搞定的，下面给出一张Vue官方的服务器渲染示意图：

![clipboard.png](./image/img1.png)

流程图大致意思是：将 Source（源码）通过 webpack 打包出两个 bundle，其中 Server Bundle 是给服务端用的，服务端通过渲染器 bundleRenderer 将 bundle 生成 html 给浏览器用；另一个 Client Bundle 是给浏览器用的，别忘了服务端只是生成前期首屏页面所需的 html ，后期的交互和数据处理还是需要能支持浏览器脚本的 Client Bundle 来完成。

### 三、具体怎么实现

实现过程就是将上面的示意图转化成代码实现，不过这个过程还是有点小复杂的，需要多点耐心去推敲每个细节。

#### 1、先实现一个基本版

项目结构示例：

```
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── src
    ├── router          
    │    └── index.js      # 路由
    └── views             
    │    ├── comp1.vue     # 组件
    │    └── copm2.vue     # 组件
    ├── App.vue            # 顶级 vue 组件
    ├── app.js             # app 入口文件
    ├──  client-entry.js          # client 的入口文件
    ├──  index.template.html      # html 模板
    ├──  server-entry.js          # server 的入口文件
```
其中：

##### （1）、comp1.vue 和 copm2.vue 组件

```JavaScript
<template>
    <section>组件 1</section>
</template>
<script>
    export default {
        data () {
            return {
                msg: ''
            }
        }
    }
</script>
```
##### （2）、App.vue 顶级 vue 组件

```JavaScript
<template>
    <div id="app">
        <h1>vue-ssr</h1>
        <router-link class="link" to="/comp1">to comp1</router-link>
        <router-link class="link" to="/comp2">to comp2</router-link>

        <router-view class="view"></router-view>
    </div>
</template>

<style lang="stylus">
    .link
        margin 10px
</style>
```
##### （3）、index.template.html html 模板

```html
<!DOCTYPE html>
<html lang="zh_CN">
<head>
    <title>{{ title }}</title>
    <meta charset="utf-8"/>
    <meta name="mobile-web-app-capable" content="yes"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
    <meta name="renderer" content="webkit"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"/>
    <meta name="theme-color" content="#f60"/>
</head>
<body>
<!--vue-ssr-outlet-->
</body>
</html>
```

##### （4）、上面基础代码不解释，接下来看

路由 router

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import comp1 from '../views/comp1.vue'
import comp2 from '../views/comp2.vue'
Vue.use(Router)
export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '/comp1',
                component: comp1
            },
            {
                path: '/comp2',
                component: comp2
            },
            { path: '/', redirect: '/comp1' }
        ]
    })
}
```
app.js app 入口文件

```javascript
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp (ssrContext) {
    const router = createRouter()
    const app = new Vue({
        router,
        ssrContext,
        render: h => h(App)
    })
    return { app, router }
}
```
我们通过 `createApp` 暴露一个根 Vue 实例，这是为了确保每个用户能得到一份新的实例，避免状态污染，所以我们写了一个
可以重复执行的工厂函数 `createApp`。 同样路由 router 我们也是一样的处理方式 `createRouter` 来暴露一个 router 实例

##### （5）client-entry.js  client 的入口文件

```javascript
import { createApp } from './app'

const { app, router } = createApp()
router.onReady(() => {
    app.$mount('#app')
})
```
客户端代码是在路由解析完成的时候讲 app 挂载到 #app 标签下

##### （7）server-entry.js  server 的入口文件

```javascript
import { createApp } from './app'

export default context => {
    // 因为这边 router.onReady 是异步的，所以我们返回一个 Promise
    // 确保路由或组件准备就绪
    return new Promise((resolve, reject) => {
        const { app, router } = createApp(context)
        router.push(context.url)
        router.onReady(() => {
            resolve(app)
        }, reject)
    })
}
```
服务器的入口文件我们返回了一个 promise

#### 2、打包

在第一步我们大费周章实现了一个带有路由的日常功能模板代码，接着我们需要利用webpack将上面的代码打包出服务端和客户端key的代码，入口文件分别是 `server-entry.js ` 和 `client-entry.js `

##### （1）、 webpack构建配置

一般配置分为三个文件：base, client 和 server。基本配置(base config)包含在两个环境共享的配置，例如，输出路径(output path)，别名(alias)和 loader。服务器配置(server config)和客户端配置(client config)，可以通过使用 webpack-merge 来简单地扩展基本配置。

> webpack.base.config.js 配置文件

``` javascript
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    devtool: '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name]-[chunkhash].js'
    },
    resolve: {
        alias: {
            'public': path.resolve(__dirname, '../public'),
            'components': path.resolve(__dirname, '../src/components')
        },
        extensions: ['.js', '.vue']
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [
            {
                test: /\.(js|vue)/,
                use: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        preserveWhitespace: false,
                        postcss: [
                            require('autoprefixer')({
                                browsers: ['last 3 versions']
                            })
                        ]
                    }
                }
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.json/,
                use: 'json-loader'
            }
        ]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: 'warning'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }),
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].css'
        })
    ]
}
```

> webpack.client.config.js 配置文件

```JavaScript
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const glob = require('glob')
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
        // 这是将服务器的整个输出
        // 构建为单个 JSON 文件的插件。
        // 默认文件名为 `vue-ssr-server-bundle.json`
        new VueSSRClientPlugin()
    ]
})
module.exports = config
```

> webpack.server.config.js 配置文件

```javascript
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: './src/server-entry.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        alias: {
            'create-api': './create-api-server.js'
        }
    },
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRServerPlugin()
    ]
})
```

webpack 配置完成，其实东西也不多，都是常规配置。需要注意的是 `webpack.server.config.js` 配置，output是生成一个 commonjs 的 library， `VueSSRServerPlugin` 用于这是将服务器的整个输出构建为单个 JSON 文件的插件。


##### （2）、 webpack build poj

webpack 配置完成，其实东西也不多，都是
