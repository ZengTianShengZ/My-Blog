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