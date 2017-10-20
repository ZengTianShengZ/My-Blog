/**
 * @description: mainjs
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
require.config({
    paths: {
        "jquery": "./lib/jquery.min",
        "math": './src/math',
        "add50": './src/add50'
    }
});

require(['jquery','math','jquery'], function ($,math){
    console.log('start main.js ...✈️')

    $('#j_ptext').css('color','red')

    console.log(math.add(1,1))

});
// require(['add50'], function (add50){
//     console.log(add50.add50(50))
// });