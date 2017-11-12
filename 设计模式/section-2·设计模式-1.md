
### 一、单例设计模式

`定义： 保证一个类只有一个实例，并提供一个访问它的全局访问点`

> Explain: 什么情况下我们只需要一个对象呢，比如线程池，全局缓存，或者是登录的浮窗只需创建一次等等。

#### 1、一般实现方式
```
let Singleton = function(name) {
  this.name = name
  this.istance = null
}
Singleton.getInstance = function(name) {
  if(!this.Singleton) {
     this.istance = new Singleton(name)
  }
  return this.istance
}
let a = Singleton.getInstance('single 1')
let b = Singleton.getInstance('single 2')

console.log(a === b) // ture
```
`缺点：` Singleton 这个类 `不够透明` ，使用者不加说明的话不知道这个是一个单例类，有可能通过 new xxx 的方式
来获取对象，而不是 Singleton.getInstance 方式去获取单例；而且这个类不符合 `单一职责原则` ，因为这个类内部做了
两件事，一个创建对象，而是初始化对象且保证只有一个对象。

#### 2、创建单例函数
```
const getSingle = function (fn) {
  let result
  return function () {
    return result || (fn.apply(this, arguments))
  }
}
```
result 用来保存 fn 的计算结果，因为 result 变量在闭包中，不会销毁，当被赋值过一次时 getSingle 函数会直接返回该结果
#### 3、例子
下面以创建一个单一浮窗为例子
```
let creatLayer = function() {
  var div = document.createElement('div')
  div.innerHTML = '浮窗'
  document.body.appendChild(div)
  return div
}

let getLayer_1 = getSingle(creatLayer)
let getLayer_2 = getSingle(creatLayer)
console.log(getLayer_1 === getLayer_2) // ture

```

### 二、策略模式

`定义： 定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换`

> Explain: 什么情况下我们需要使用 策略模式 呢，比多种表单的校验，一下场景多种身份的切换等等有多重 if-else 分支的情况，那可以考虑下 策略模式

#### 1、一般实现方式
不如一个奖励金计算的例子：绩效为S级奖励金为4倍工资，A级3倍，B级2倍，你会如何实现呢
```
const calculateBons = function(perf, salary){
  if(perf === 'S'){
    return salary * 4
  }
  if(perf === 'A'){
    return salary * 3
  }
  if(perf === 'B'){
    return salary * 2
  }
}
let result_1 = calculateBons("B", 2000) // 输出 4000
let result_2 = calculateBons("S", 5000) // 输出 20000
```

#### 2、策略模式的实现
```
// 策略类，封装一系列算法
const strategies = {
  "S": function(salary){
    return salary * 4
  },
  "A": function(salary){
    return salary * 3
  },
  "B": function(salary){
    return salary * 2
  }
}
// 环境类
const calculateBons = function(lever, salary){
  return strategies[lever](salary)
}

let result_1 = calculateBons("B", 2000) // 输出 4000
let result_2 = calculateBons("S", 5000) // 输出 20000
```

#### 3、策略模式说明
一个基于策略模式至少有两部分组成。一是 `策略类` （strategies），`策略类` 封装了具体的算法，并负责具体的计算过程；二是 `环境类` （calculateBons），`环境类` 接受客户的请求，并把请求委托给某一个策略类

> 优点

- 避免多次 if-else
- 策略模式的算法 `策略类` 可以被其他地方复用

> 缺点

- 调用者必须知道策略模式的算法 `策略类` 的具体实现，不然不知道该用哪个具体算法，不符合最少知识原则

### 三、代理模式
`定义： 为一个对象提供代用品或占位符，以便控制对它的访问`

> Explain: 其实代理模式很好理解，如何小明最求女神A，要送花给女神A但有不好意思，就通过B作为代理，由B送花给A

#### 1、简单例子：
没用代理的情况：
```
  var Flower = function(){}
  var xiaoming = {
    sendFlower: function(target){
      var flower = new Flower()
      target.receiveFlower(flower)
    }
  }

  var A = {
    receiveFlower: function(flower) {
      console.log('收到🌹'+ flower)
    }
  }
  xiaoming.sendFlower(A)
```
用代理的情况：
```
  var Flower = function(){}
  var xiaoming = {
    sendFlower: function(target){
      var flower = new Flower()
      target.receiveFlower(flower)
    }
  }
  // 代理 B
  var B= {
    receiveFlower: function(flower) {
      A.receiveFlower(flower)
    }
  }
  var A = {
    receiveFlower: function(flower) {
      console.log('收到🌹'+ flower)
    }
  }
  xiaoming.sendFlower(B)
```
显然上面的结果是一致的,但引入代理也显得复杂了，这个有必要吗。当然上面的例子只是说明问题而已。
想一想，那如果 `new Flower()` 是一个比较麻烦的事情，那不是不可以交给代理去做呢，那代理就变得
有点用处了
```
  // 代理 B
  var B= {
    receiveFlower: function() {
      var flower = new Flower()
      A.receiveFlower(flower)    }
  }
```
所以代理B 不仅可以帮小明做一些事情，还可以帮女神A过滤掉一些东西，比如女神A不喜欢话，喜欢跑车，那代理B
就可以帮忙过滤掉了。

#### 2、在一个图片加载的例子
网页加载大图片时有时候因为网络问题二出现页面空白，可以通过代理，在加载图片的时候先显示一致 gif

```
  var myImage = (function(){
    var imgNode = document.createElement('img')
    document.body.appendChild(imgNode)
    return {
      setSrc : function(src){
        imgNode.src = src
      }
    }
  })()
  var proxyImg = (function(){
    var img = new image
    img.onload = function(){
      myImage.setSrc(this.src)
    }
    return {
      setSrc : function(src){
        myImage.setSrc('./img/loading.gif')
        img.src = src
      }
    }
    })()
    proxyImg.setSrc('http://img.com.xxxxx.jpg')
```
上面可以看出使用代理的两点好处：
`单一职责原则` : 一个类（对象或函数），应该只有一个引起它变化的原因
上面图片加载，使用了代理 proxyImg 去做网络请求图片，职责单一 ， myImage 去做图片显示，职责也是单一
`开放封闭原则`: 软件实体（类、模块、函数等）应该是可以扩展的，但是不可修改的。
如果几年后网速大幅提高，那就不必使用 proxyImg 方法来预加载一张 loading 图片，那上面的写法完全不用修改，
去掉 proxyImg 方法，直接用 myImage 方法即可

当然，这两个特性也不完全体现在代理模式下，代理模式除了这两个特性也还有上面说到的，利用代理可以多做一些
中间键的事情，比如过滤，预加载等。
