const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/hello.vue'
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
                },
                exclude: /node_modules/
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            },
        ]
    },
    plugins:[

    ]
}
