
### 第一章： 作用域是什么

#### 1、 编译原理

JavaScript 被列为 ‘动态’ 或 ‘解释执行’ 语言，于其他传统语言（如 java）不同的是，JavaScript是边编译边执行的。
一段源码在执行前会经历三个步骤： `分词/词法分析` -> `解析/语法分析` -> `代码生成`

  - 分词/词法分析

  这个过程将字符串分解成词法单元，如 var a = 2; 会被分解成词法单元 var、 a、 = 、2、;。空格一般没意义会被忽略

  - 解析/语法分析

  这个过程会将词法单元转换成 `抽象语法树`（Abstract Syntax Tree,AST）。
  如  var a = 2; 对应的 `抽象语法树` 如下, 可通过 [在线可视化AST](https://astexplorer.net/) 网址在线分析

```
{
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 10,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 9,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 9,
            "value": 2,
            "raw": "2"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```
  - 代码生成

  将 AST 转换成可执行的代码，存放于内存中，并分配内存和转化为一些机器指令

#### 2、理解作用域

其实结合上面提到的编译原理，作用域就好理解了。作用域就是当前执行代码对这些标识符的访问权限。
编译器会在当前作用域中声明一些变量，运行时引擎会去作用域中查找这些变量（其实就是一个寻址的过程），如果找到这些变量就可以操作变量，找不到就往上一层作用域找（作用域链的概念），或者返回 null


### 第三章： 函数作用域和块作用域

#### 1、函数中的作用域

每声明一个函数都会形成一个作用域，那作用域有什么用呢，它能让该作用域内的变量和函数不被外界访问到，也可以反过来说是不让该作用域内的变量或函数污染全局。

对比：
```
var a = 123
function bar() {
  //...
}
```
和
```
function foo() {
  var a = 123
  function bar() {
    //...
  }
}
```
变量 a 和函数 bar 用一个函数 foo 包裹起来，函数 foo 会形成一个作用域，变量 a 和函数 bar 外界将无法访问，同时变量或函数也不会污染全局。

#### 2、函数作用域

进一步思考，上面例子的变量 a 和函数 bar 有了作用域，但函数 foo 不也是暴露在全局，也对全局造成污染了啊。是的，JavaScript对这种情况提出了解决方案： `立即执行函数 (IIFE)`

```
(function foo() {
  var a = 123
  function bar() {
    //...
  }
})()
```

第一个（）将函数变成表达式，第二个（）执行了这个函数，最终函数 foo 也形成了自己的作用域，不会污染到全局，同时也不被全局访问的到。

#### 3、块作用域

es6之前JavaScript是没有块作用域这个概念的，这与一般的语言（如Java ，C）很大不同，看下面这个例子：

```
for (var i = 0; i < 10; i++) {
  console.log('i=', i);
}
console.log('输出', i); // 输出 10
```
for 循环定义了变量 i，通常我们只想这个变量 i 在循环内使用，但忽略了 i 其实是作用在外部作用域(函数或全局)的。所以循环过后也能正常打印出 i ,因为没有块的概念。

甚至连 try/catch 也没形成块作用域:

```
try {
  for (var i = 0; i < 10; i++) {
    console.log('i=', i);
  }
} catch (error) {}
console.log('输出', i); // 输出 10
```

> 解决方法1

形成块作用域的方法当然是使用 es6 的 let 和 const 了， let 为其声明的变量隐式的劫持了所在的块作用域。

```
for (let i = 0; i < 10; i++) {
  console.log('i=', i);
}
console.log('输出', i); // ReferenceError: i is not defined
```
将上面例子的 var 换成 let 最后输出就报错了 ReferenceError: i is not defined ，说明被 let 声明的 i 只作用在了 for 这个块中。

除了 let 会让 for、if、try/catch 等形成块，JavaScript 的 `{}` 也能形成块

```
{
  let name = '曾田生'
}

console.log(name); //ReferenceError: name is not defined
```

> 解决方法2

早在没 es6 的 let 声明之前，常用的做法是利用 `函数也能形成作用域` 这么个概念来解决一些问题的。

看个例子
```
function foo() {
  var result = []
  for (var i = 0; i < 10; i++) {
    result[i] = function () {
      return i
    }
  }
  console.log(i）// i 作用在整个函数，for 执行完此时 i 已经等于 10 了
  return result
}
var result = foo()
console.log(result[0]()); // 输出 10 期望 0
console.log(result[1]()); // 输出 10 期望 1
console.log(result[2]()); // 输出 10 期望 2
```

这个例子出现的问题是执行数组函数最终都输出了 10， 因为 i 作用在整个函数，for 执行完此时 i 已经等于 10 了, 所以当后续执行函数 `result[x]()` 内部返回的 i 已经是 10 了。

利用函数的作用域来解决

```
function foo() {
  var result = []
  for (var i = 0; i < 10; i++) {
    result[i] = function (num) {
      return function () { // 函数形成一个作用域，内部变量被私有化了
        return num
      }
    }(i)
  }
  return result
}
var result = foo()
console.log(result[0]()); // 0
console.log(result[1]()); // 1
console.log(result[2]()); // 2
```

上面的例子也是挺典型的，一般面试题比较考基础的话就会被问道，上面例子不仅考察到了块作用域的概念，函数作用域的概念，还考察到了闭包的概念（闭包后续讲但不影响这个例子的理解），多琢磨一下就理解了。

### 第四章： 提升

提升指的是变量提升和函数提升，为什么JavaScript会有提升这个概念呢，其实也很好理解，因为JavaScript代码是先 `编译` 后 `执行` 的，所以在编译阶段就会先对变量和函数做声明，在执行阶段就出现了所谓的变量提升和函数提升了。

#### 1、变量提升

```
console.log(a); // undefined
var a = 1;
```
上面代码 `console.log(a); // undefined` 就是因为编译阶段先对变量做了声明,先声明了个变量 a, 并默认赋值 undefined

```
var a;
console.log(a); // undefined
a = 1;
```

#### 2、函数提升

函数同样也存在提升，这就是为什么函数能先调用后声明了

```
foo();
function foo() {
  console.log('---foo----');
}
```

注意:函数表达式不会被提升

```
foo();
var foo = function() {
  console.log('---foo----');
}
// TypeError: foo is not a function
```

注意：函数会首先被提升，然后才是变量

```
var foo = 1;
foo();
function foo() {
  console.log('---foo----');
}
// TypeError: foo is not a function
```

分析一下，因为上面例子编译后是这样的

```
var foo = undefined; // 变量名赋值 undefined
function foo() {     // 函数先提升
  console.log('---foo----');
}
foo = 1;             // 但接下去是变量被重新赋值了 1，是个Number类型
foo();               // Number类型当然不能用函数方式调用，就报错了
// TypeError: foo is not a function
```

### 第五章： 作用域闭包

闭包问题一直会在JavaScript被提起，是JavaScript一个比较奇葩的概念

#### 1、闭包的产生

> 闭包的概念： 当函数可以记住并访问所在的词法作用域时，就产生了闭包

概念貌似挺简单的，简单分析下，首先闭包是 `产生的`，是在代码执行中产生的，有的一些网络博文直接将闭包定义为 `某一个特殊函数` 是错的。

闭包是怎么产生的呢，一个函数能访问到所在函数作用域就产生了闭包，注意到作用域的概念，咱们最上面的章节有提到，看下面例子：

```
function foo() {
  var a = 0;
  function bar() {
    a++;
    console.log(a);
  }
  return bar;
}

var bat = foo()
bat() // 1
bat() // 2
bat() // 3
```

结合例子分析一下： 函数 foo 内部返回了函数 bar ,外部声明个变量 bat 拿到 foo 返回的函数 bar ，执行 bat() 发现能正常输出 1 ，注意前面章节提到的作用域，变量 a 是在函数 foo 内部的一个私有变量，不能被外界访问的，但外部函数 bat 却能访问的到私有变量 a，这说明了 `外部函数 bat 持有函数 foo 的作用域` ，也就产生了闭包。

闭包的形成有什么用呢，JavaScript 让闭包的存在明显有它的作用，其中一个作用是为了模块化，当然你也可以利用外部函数持有另一个函数作用域的闭包特性去做更多的事情，但这边就暂且讨论模块化这个作用。

函数有什么作用呢，私有化变量或方法呀，那函数内的变量和方法被私有化了函数怎么和外部做 `交流` 呢, 暴露出一些变量或方法呀

```
function foo() {
  var _a = 0;
  var b = 0;
  function _add() {
    b = _a + 10    
  }
  function bar() {
    _add()
  }
  function getB() {
    return b
  }
  return {
    bar: bar,
    getB: getB
  }
}

var bat = foo()
bat.bar()
bat.getB() // 10
```

上面例子函数 foo 可以理解为一个模块，内部声明了一些私有变量和方法，也对外界暴露了一些方法，只是在执行的过程中顺带产生了一个闭包

#### 2、模块机制

上面提到了闭包的产生和作用，貌似在使用 es6语法 开发的过程中很少用到了闭包，但实际上我们一直在用闭包的概念的。

>  foo.js

```
var _a = 0;
var b = 0;
function _add() {
  b = _a + 10
}
function bar() {
  _add()
}
function getB() {
  return b
}
export default {
  bar: bar,
  getB: getB
}
```

>  bat.js

```
import bat from 'foo'

bat.bar()
bat.getB() // 10
```

上面例子是 es6 模块的写法，是不是惊奇的发现变量 bat 可以记住并访问模块 foo 的作用域，这符合了闭包的概念。


### 小结：

本章节我们深入理解了JavaScript的 `作用域`，`提升`，`闭包`等概念，希望你能有所收获，这也是我在读《你不知道的JavaScript·上卷》的一些体会。下一部分整理下 `this解析`、`对象`、`原型` 等一些概念。

