
module.exports = {
    entry: {
        app: './app.js'
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
                    // options: {
                    //     presets: [
                    //         ["env", {
                    //             "modules": false
                    //         }],
                    //         "es2015"
                    //     ]
                    // }
                },
                exclude: /node_modules/
            }
        ]
    }
}