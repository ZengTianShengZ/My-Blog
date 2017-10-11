
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

### 一、策略模式

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
