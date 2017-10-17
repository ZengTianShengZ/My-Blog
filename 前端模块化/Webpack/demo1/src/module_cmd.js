/**
 * @description: module-cmd
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
define(function(require, exports, module) {
    var add = function (x,y){
        return x+y;
    };
    // 或者通过 module.exports 提供整个接口
    module.exports = {add}
});