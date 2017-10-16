/**
 * @description: 模块中依赖其他模块
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
define(['math'],function (math){
    var add50 = function (x){
        return math.add(x, 50)
    };
    return {
        add50: add50
    };
});