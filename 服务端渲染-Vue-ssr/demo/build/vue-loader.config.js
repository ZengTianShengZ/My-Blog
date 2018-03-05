/**
 * @description: 文件或模块描述
 * @author: zengtiansheng
 * @update: 2018/3/2
 */
module.exports = {
    extractCSS: process.env.NODE_ENV === 'production',
    preserveWhitespace: false,
    postcss: [
        require('autoprefixer')({
            browsers: ['last 3 versions']
        })
    ]
}