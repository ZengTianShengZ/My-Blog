/**
 * @description: 文件或模块描述
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
// 所有模块都通过 define 来定义
define(function(require, exports, module) {
    console.log('start main.js ...✈️')

    // 通过 require 引入依赖
    require('jquery');
    $('#j_ptext').css('color','red')

    var math = require('./src/math');
    console.log(math(2,9))
});
