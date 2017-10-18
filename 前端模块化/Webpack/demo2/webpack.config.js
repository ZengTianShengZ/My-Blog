const webpack = require('webpack');

module.exports = {
    entry: {
        app: './app.js',
        vendor: ['./src/a.js'] // 指定公共模块
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    // options: {  // 此处配置可以写到 .babelrc 文件下
                    //     presets: [
                    //         "es2015"
                    //     ]
                    // }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins:[
        // 情况 1
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',       // 上面 entry 入口定义的节点组
        //     filename:'vendor.js'  //最后生成的文件名，随意
        // }),

        // 情况 2
        // webpack的运行文件会先 找 上面 entry 入口定义的节点组 生成vendor.js，
        // 然后`webpack的运行文件`会被从vendor中再次抽出，
        // 生成一个manifest.js文件
        new webpack.optimize.CommonsChunkPlugin({
            name:['vendor','manifest'], // 上面入口定义的节点组
        }),

    ]
}