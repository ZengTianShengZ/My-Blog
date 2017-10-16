
# 前端模块化

### 1、石器时代
- 以前我们是这么写代码的：
```
function foo(){
    //...
}
function bar(){
    //...
}
```
都知道这样会造成变量的全局污染，变量名冲突

- 后来我们做了改进：
```
var Module = (function($){
    var _$body = $("body");     // we can use jQuery now!
    var foo = function(){
        console.log(_$body);    // 特权方法
    }
    // Revelation Pattern
    return {
        foo: foo
    }
})(jQuery)

Module.foo();
```
利用匿名闭包的模式包裹变量，并暴露一些公共方法，还可以引入依赖 `jQuery`,
也就是 `模块模式` ， 也就是现代模块实现的基石

- 虽然做了模块化封装，但还不够

现实项目中我们往往需要加载多个脚本
```
   script(src="zepto.js")
   script(src="jhash.js")
   script(src="fastClick.js")
   script(src="iScroll.js")
   script(src="underscore.js")
   script(src="handlebar.js")
   script(src="datacenter.js")
   script(src="deferred.js")
   script(src="util/wxbridge.js")
   script(src="util/login.js")
   script(src="util/base.js")
   script(src="util/city.js")
   script(src="util/date.js")
   script(src="util/cookie.js")
   script(src="app.js")
```
项目脚本的加载，弊端是
难以维护，需要顺序执行，依赖模糊，请求过多

### 2、模块时代的到来 ： CommonJS 规范
跳出浏览器，CommonJS 是以在浏览器环境之外构建 JavaScript 生态系统为目标而产生的项目，
比如在服务器 node 环境中

模块的定义和使用

```
// math.js
exports.add = function(a, b) {
  return a + b;
};
-----------------------------------
// main.js
var math = require('./math.js');
math.add(111,222); // 333
------------------------------------
// node  main.js  执行
```
或许你可能在别的地方看到 `module.exports` 的方式来导出模块，`module.exports` 是什么玩意儿？
`exports` 只是 `module.exports` 的辅助方法，`exports` 所做的事情是收集属性，可以把 `exports` 看成一个
空对象 `exports.add = function(a, b) {}` 就是对象上定义 add() 方法，最终把收集的属性赋值
给 `module.exports` ，如果文件中存在 `module.exports` 赋值，那么将会忽略掉 `exports`收集的属性

例子：
```
// math2.js
var math2 = function() {
  this.add = function(a, b) {
    return a + b;
  };
  this.minus = function(a, b) {
    return a - b;
  };
};
// add方法 会被忽略
exports.add = function(a, b) {
  return a + b;
};
module.exports = new math2();
-----------------------------------
// main.js
var math2 = require('./math2.js');
math2.add(444,111); // 555
```

### 3、浏览器端的模块 ：AMD CMD
CommonJS 规范不适合浏览器开发， CommonJS 规范的模块加载时同步的，阻塞的，而浏览器通过网络加载模块，网速不行的话就将阻止模块的加载以及后面功能的运行。但服务端使用CommonJS 规范为什么就行呢？

因为服务端加载脚本是从磁盘硬件上读取的,下图可以看出：
同步加载对 服务器/本地环境 不是问题，浏览器环境才是问题
![clipboard.png](./image/img1.png)

（1）、浏览器模块化方案： AMD
`RequireJS` 是一个工具库，是 `AMD规范`(Asynchronous Module Definition)的实现者。或许会把 `RequireJS` 和 `AMD规范`混为一谈，AMD只是一种规范，定义异步模块的加载规则，而 `RequireJS` 是脚本代码，这套异步加载规则的实现代码。
下面一个例子利用 RequireJS 来实现 AMD规范

> index.html

引入 require.js 设置 data-main 属性（用来指定网页程序的主模块），该属性会去加载对应目录下的 main.js
```
<script src="./lib/require.js" data-main="./main"></script>
```
> main.js

`require.config` 配置需要加载的模块名和对应的加载路径
```
require.config({
    paths: {
        "jquery": "./lib/jquery.min",
        "math": './src/math',
        "add50": './src/add50'
    }
});

require(['jquery','math'], function ($,math){
    console.log('start main.js ...✈️')
    console.log(math.add(1,1))
    $('#j_ptext').css('color','red')
});
```

> math.js

`define` 定义一个待加载的模块
```
define(function (){
    console.log('start math.js ...🚘')
    var add = function (x,y){
        return x+y;
    };
    return {
        add: add
    };
});
```
如果定义的模块有依赖其他模块，添加第一个形参为模块名，如下面依赖了math模块
```
define(['math'],function (math){
    var add50 = function (x){
        return math.add(x, 50)
    };
    return {
        add50: add50
    };
});
```
可以打开 Chrome 控制台，查看 Network 目录，看的出这些模块是通过 GET 网络请求按需加载的。而且 Type 类型是 script ，相当于加载一段脚本代码，脚本代码加载完会立即执行，这一点可以等下和 CMD规范 做过比较
![clipboard.png](./image/img2.png)

（2）、浏览器模块化方案： CMD
CMD规范（Common Module Definition）同样也有对应的实现代码，那就是SeaJS ，SeaJS的作者是淘宝前端大牛玉伯，SeaJS 定义模块的风格跟 CommonJs 比较像
例子：

> index.html

引入 sea.js ，定义 config 并配置入口文件 seajs.use
```
<script src="./lib/sea.js"></script>
<script type="text/javascript">
    // seajs 的简单配置
    seajs.config({
        base: "./",
        alias: {
            "jquery": "lib/jquery.min.js"
        }
    })
    // 加载入口模块
    seajs.use("./main")
</script>
```

> main.js

```
// 所有模块都通过 define 来定义
define(function(require, exports, module) {
    console.log('start main.js ...✈️')

    // 通过 require 引入依赖
    require('jquery');
    $('#j_ptext').css('color','red')

    var math = require('./src/math');
    console.log(math(2,9))
});
```

> math.js

```
define(function(require, exports, module) {
    console.log('start math.js ...🚘')
    var add = function (x,y){
        return x+y;
    };
    // 或者通过 module.exports 提供整个接口
    module.exports = add
});
```
