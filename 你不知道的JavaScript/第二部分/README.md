### 第一章： 关于this

> this 到底是什么

this 是在 `运行时` 绑定的，this的绑定和函数声明的位置没有任何关系，只却取决于函数的 `调用方式` 。

```
function foo() {
  this.bar()
}
function bar() {
  console.log('---bar---');
}
foo()
```

上段代码在浏览器下是能正常执行的，函数 bar 能被正常调用，因为函数 bar 是声明在全局的，全局的 this 指向 window ， 执行函数 foo 时也是在全局（window）下执行的，所以函数内部的 this 也是指向 window 的，相对于在函数 foo 内部 是 `window.bar()` ，自然能正常调用执行。

但在严格模式下 'use strict' ， 全局 this 不指向 window，而是 undefined，所以在严格模式下上面代码会报错

### 第二章： this全面解析

#### 1、调用位置 

一个很简单的判断 this 指向谁就看函数在代码的调用位置

> 例子1

下面这个例子第一章节分析的一样，函数 foo 在全局调用， 在浏览器下 this 指向 wwindow，当然要是考虑严格模式， this.a 会报错 a is not defined

```
a = 1;
function foo() {
  console.log(this.a); // 1
}
foo();
```

> 例子2

下面例子虽然同一个函数 foo ，但却被不同的对象调用，this 分别指向它的调用者

```
function foo() {
  console.log(this.a);
}
var obj1 = {
  foo: foo,
  a: 1
}

var obj2 = {
  foo: foo,
  a: 2
}
obj1.foo() // 1
obj2.foo() // 2
```

> 特殊例子3

下面例子虽然函数 foo 声明在全局，但被利用 `call`、`apply`、`bind` 显式的绑定了对象，this 指向显式绑定的对象

```
function foo() {
  console.log(this.a);
}
var obj1 = {
  a: 1
}
var obj2 = {
  a: 2
}
var obj3 = {
  a: 3
}
foo.call(obj1) // 1
foo.apply(obj2) // 2
foo.bind(obj3)() // 3
```

> 例子4

下面例子使用了 new 绑定，this 指向了该对象

```
function foo(a) {
  this.a = a
}
var bar = new foo(1)
console.log(bar.a);
```

使用 new 来调用函数经历了一下步骤：

1、创建或者说构造一个全新的对象

2、这个新对象会被执行[Prototype]连接

3、这个新对象会被绑定到函数调用的 this

4、如果这个函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象


> 小结：

经过上面的例子分析，判断 this 的指向可以罗列几个点，

1、看调用者，函数被谁调用 this 指向谁

2、是否有 `call`、`apply`、`bind` 显式的改变了 this 的指向

3、函数是否是被 new 创建的，是的话 this 指向 new 出来的对象


### 第三章： 对象

对象再熟悉不过了，对象的基本要素就是属性和方法，但有时候代码写着写着就忘了对象本来的特征。

#### 1、内置对象

> String

```
var str = 'i am a string';
str.length ;      // 13
str.charAt(3);    // m
```

咱们经常使用字符串，没但没发觉字符串怎么会有属性和方法，这个特性应该对象才有的呀。原来JavaScript 引擎自动把字符串转换成 String 对象，所以可以访问属性和方法。

> Array

数组也是 JavaScript 的内置对象，那既然是对象是不是也可以像对象那样赋值和操作呢。

```
var arr = ['foo', 'bar'];
arr.baz = 'baz';
console.log(arr.baz);
```
上面例子不像以往那样操作数组，而是按对象的形式进行操作，是可行的。但这里也是为了给大家解释数组也是对象这么个基本概念，一般不将数组当做普通键值对象来使用。


内置对象除了上面提到的 String，Array，还有 Number、Boolean、Object、Function、Date、RegExp、Error

#### 2、属性描述符

```
var obj = {
  a: 1
}
```
对象 obj 的属性 a 就单单记录一个数值 1 吗，其实不是的，咱们用 `getOwnPropertyDescriptor` 打印下属性 a 看下输出信息

```
console.log(Object.getOwnPropertyDescriptor(obj, 'a'));
// 输出
{
  value: 1, 
  writable: true,
  configurable: true,
  enumerable: true
}
```
几个属性来解释一下

> writable

writable 决定是否可以修改属性值

```
var obj = {}
Object.defineProperty(obj, 'a', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: true
})
obj.a = 2
console.log(obj.a); // 1
```
writable 属性置为 false 发现无法更改属性的值了

> configurable

configurable 属性用来描述对象的属性是否可配置，也就是 configurable = false，接下去代码想要将 configurable = true 将会报错，因为对象的属性不可配置了

> enumerable

enumerable 属性用来设置该对象属性是否可枚举， enumerable = false 那么该对象属性将不在枚举中，也就是 for...in 将不会遍历到该属性

#### 3、Getter和Setter

对象还有两个隐藏的函数会被忽略，因为是 JavaScript 的默认操作，没特殊用法的话就不会去修改它，如果重新修改了 Getter和Setter 隐藏函数，JavaScript会忽略它们的 value 和 writable 特性 

下面一个例子对属性 a 进行  Getter和Setter 重写

```
var obj = {
  get a() {
    return this._a_
  },
  set a(val) {
    this._a_ = val * 2
  }
}

obj.a = 2
console.log(obj.a); // 4
```
因为对赋值和取值时都会触发相应的 get 和 set 方法，那就可以利用这个特性做一些比如消息的发布订阅，事件通知能等高级用法了

