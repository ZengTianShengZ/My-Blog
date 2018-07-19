# Vue.js内部运行机制浅解

## 一、内部流程图

![img.png](./image/img1.png)

### 1、初始化及挂载

在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，也就是这里的 init 过程，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」。

### 2、编译

compile编译可以分成 parse、optimize 与 generate 三个阶段，最终需要得到 render function。

> parse

parse 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST。

> optimize

optimize 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。

> generate

generate 是将 AST 转化成 render function 的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

在经历过 parse、optimize 与 generate 这三个阶段以后，组件中就会存在渲染 VNode 所需的 render function 了。

### 3、响应式

响应式部分会对数据进行响应式响应和依赖收集

### 4、Virtual DOM

render function 会被转化成 VNode 节点。Virtual DOM 其实就是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。

如下面的例子：

```
{
    tag: 'div',                 /*说明这是一个div标签*/
    children: [                 /*存放该标签的子节点*/
        {
            tag: 'a',           /*说明这是一个a标签*/
            text: 'click me'    /*标签的内容*/
        }
    ]
}
```

渲染后可以得到

```
<div>
    <a>click me</a>
</div>
```

### 5、更新视图

更新视图可不是简单粗暴的得到一个新的VNode 节点，然后用 innerHTML 直接全部渲染到真实 DOM 中。但是其实我们只对其中的一小块内容进行了修改，这样做似乎有些「浪费」。「patch」就是对更新视图做了优化。我们会将新的 VNode 与旧的 VNode 一起传入 patch 进行比较，经过 diff 算法得出它们的「差异」。最后我们只需要将这些「差异」的对应 DOM 进行修改即可。

## 二、响应式系统的基本原理

Vue.js就是基于 [Object.defineProperty]() 实现「响应式系统」的.

Object.defineProperty(obj, attr, descriptor)  的参数如下

```
obj 为属性attr所属的对象；
attr 为obj对象新定义或者修改的属性名；

descriptor 为该对象属性的描述符，其中其有6个配置项：
value: 属性的值，默认undefined
configurable: 默认为false，true表示当前属性是否可以被改变或者删除，其中”改变“是指属性的descriptor的配置项configurable、enumerable和writable的修改
enumerable：默认为false，true表示当前属性能否被for...in或者Objectk.keys语句枚举
writable：默认为false，true表示当前属性的值可以被赋值重写
get：默认undefined，获取目标属性时执行的回调方法，该函数的返回值作为该属性的值
set：默认undefined，目标属性的值被重写时执行的回调
```

从上面的用法可以知道：可以通过设置get和set方法对属性的读取和修改进行拦截，通过将实现数据和视图同步的逻辑置于这两个方法中，从而实现数据变更视图也可以跟着同步

一个demo：

```javaScript
function cb(val) {
  /* 渲染视图 */
  console.log("视图更新啦～");
}

function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    /* 属性可枚举 */
    configurable: true,
    /* 属性可被修改或删除 */
    get: function reactiveGetter() {
      return val; /* 实际上会依赖收集，下一小节会讲 */
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      cb(newVal);
    }
  });
}

function observer(value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }
  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key]);
  });
}

class Vue {
  /* Vue构造类 */
  constructor(options) {
    // 将 data 转化为带有 get set (响应式)的  _data ！！！
    this._data = options.data;
    observer(this._data);
  }
}

let o = new Vue({
  data: {
    test: "I am test."
  }
});
o._data.test = "hello,world."; /* 视图更新啦～ */
```


## 三、响应式系统的依赖收集追踪原理

### 1、为什么需要依赖收集

首先要明白为什么需要依赖收集

假如有这么一个 Vue 对象：

```
new Vue({
    template: 
        `<div>
            <span>{{text1}}</span> 
            <span>{{text2}}</span> 
        <div>`,
    data: {
        text1: 'text1',
        text2: 'text2',
        text3: 'text3'
    }
});
```

我们做了这么一个操作

```
this.text3 = 'modify text3';
```

我们修改了 data 中 text3 的数据，但是因为视图中并不需要用到 text3，所以理论上是不需要进行视图更新。所以我们需要对视图用到的数据进行依赖收集，当收集的数据有改变时再做视图更新。依赖收集是为了优化视图更新用的。

### 2、模拟依赖收集

demo：

```javaScript
class Dep {
  constructor() {
    /* 用来存放Watcher对象的数组 */
    this.subs = [];
  }
  /* 在subs中添加一个Watcher对象 */
  addSub(sub) {
    this.subs.push(sub);
  }
  /* 通知所有Watcher对象更新视图 */
  notify() {
    this.subs.forEach((sub) => {      
      sub.update();
    })
  }
}
Dep.target = null;

class Watcher {
  constructor() {
    /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
    Dep.target = this;
  }
  /* 更新视图的方法 */
  update() {
    console.log("视图更新啦～");
  }
}

function cb(val) {
  console.log("视图更新啦～");
}
function defineReactive(obj, key, val) {
  /* 一个Dep类对象 */
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target);
      return val; /* 实际上会依赖收集，下一小节会讲 */
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify();
      // cb(newVal);
    }
  });
}

function observer(value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }
  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key]);
  });
}

class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data);
    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
    new Watcher();
    /* 在这里模拟render的过程，为了触发test属性的get函数 */
    console.log('render~', this._data.test);
  }
}

let o = new Vue({
  data: {
    test: "I am test.",
    test2: "I am test2."
  }
});
o._data.test = "hello,world.";   // 视图更新啦～
o._data.test2 = "hello,world.";  // 视图没触发更新
```

相比第二节我们新添加了个 Dep 类，用于收集依赖用的，新添加了个 Watcher 类，用于数据变化更新视图用的。

上面 demo 最主要的就是触发依赖收集这一步了

```
/* 在这里模拟render的过程，为了触发test属性的get函数 */
console.log('render~', this._data.test);
```

这里用获取数据的方式来触发对应的 get函数，接着在 get函数里我们往 Dep 对象的 subs 属性添加了个 Watcher 对象，用于后续的视图更新操作

```
get: function reactiveGetter() {
  /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
  dep.addSub(Dep.target);
  return val;
},
```


## 四、Virtual DOM 的一个 VNode 节点

Virtual DOM 其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。

比如这么一个 Vue 组件：

```html
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>
```

用 JavaScript 代码形式就是这样的:

```javaScript
function render() {
  return new VNode(
    'span', {
      /* 指令集合数组 */
      directives: [{
        /* v-show指令 */
        rawName: 'v-show',
        expression: 'isShow',
        name: 'show',
        value: true
      }],
      /* 静态class */
      staticClass: 'demo'
    }, [new VNode(undefined, undefined, undefined, 'This is a span.')]
  );
}
```
看看转换成 VNode 以后的情况:

```
{
  tag: 'span',
  data: {
      /* 指令集合数组 */
      directives: [
          {
              /* v-show指令 */
              rawName: 'v-show',
              expression: 'isShow',
              name: 'show',
              value: true
          }
      ],
      /* 静态class */
      staticClass: 'demo'
  },
  text: undefined,
  children: [
      /* 子节点是一个文本VNode节点 */
      {
          tag: undefined,
          data: undefined,
          text: 'This is a span.',
          children: undefined
      }
  ]
}
```

其中转换函数如下：

```javascript
class VNode {
  constructor(tag, data, children, text, elm) {
    /*当前节点的标签名*/
    this.tag = tag;
    /*当前节点的一些数据信息，比如props、attrs等数据*/
    this.data = data;
    /*当前节点的子节点，是一个数组*/
    this.children = children;
    /*当前节点的文本*/
    this.text = text;
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm;
  }
}
```

既然 Virtual DOM 能用 js 来生成和表示，自然还可以多做一些操作，比如

- 创建一个空节点

```javascript
function createEmptyVNode () {
  const node = new VNode();
  node.text = '';
  return node;
}
```

- 创建一个文本节点

```
function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val));
}
```

等等节点的一系列 CRUD

## 五、Compile 编译 template 模板

这一步对应文章刚开始的流程图中的 `2、编译` 部分。

compile 编译可以分成 parse、optimize 与 generate 三个阶段，最终需要得到 render function

下面以解析一个 template 片段为例来讲解 compile 过程：

```html
<div :class="c" class="demo" v-if="isShow">
    <span v-for="item in sz">{{item}}</span>
</div>
```

### 1、parse

parse 会用正则等方式将 template 模板中进行字符串解析，得到指令、class、style等数据，形成 AST（抽象语法树（abstract syntax tree或者缩写为AST））

比如上面的 template 片段会被解析为：

```
{
  /* 标签属性的map，记录了标签上属性 */
  'attrsMap': {
    ':class': 'c',
    'class': 'demo',
    'v-if': 'isShow'
  },
  /* 解析得到的:class */
  'classBinding': 'c',
  /* 标签属性v-if */
  'if': 'isShow',
  /* v-if的条件 */
  'ifConditions': [
    {
      'exp': 'isShow'
    }
  ],
  /* 标签属性class */
  'staticClass': 'demo',
  /* 标签的tag */
  'tag': 'div',
  /* 子标签数组 */
  'children': [
    {
      'attrsMap': {
          'v-for': "item in sz"
      },
      /* for循环的参数 */
      'alias': "item",
      /* for循环的对象 */
      'for': 'sz',
      /* for循环是否已经被处理的标记位 */
      'forProcessed': true,
      'tag': 'span',
      'children': [
          {
              /* 表达式，_s是一个转字符串的函数 */
              'expression': '_s(item)',
              'text': '{{item}}'
          }
      ]
    }
  ]
}
```

parse 基本方案是用正则匹配，至于具体的解析过程就不分析了，太麻烦太复杂了 🤦‍ 

### 2、optimize

optimize 主要作用就跟它的名字一样，用作「优化」，optimize 过程就是对第 1 步 parse出的节点做标记，标记出一些静态节点，为了后面节点 diff 做优化，节省性能。

标记后的节点如下，每个节点都会加上 static 属性， static=true 为静态节点，当节点有 `v-if`, data 等属性就会被标记为非静态节点  static=false

```
{
    'attrsMap': {
        ':class': 'c',
        'class': 'demo',
        'v-if': 'isShow'
    },
    'classBinding': 'c',
    'if': 'isShow',
    'ifConditions': [
        'exp': 'isShow'
    ],
    'staticClass': 'demo',
    'tag': 'div',
    /* 静态标志 */
    'static': false,
    'children': [
        {
            'attrsMap': {
                'v-for': "item in sz"
            },
            'static': false,
            'alias': "item",
            'for': 'sz',
            'forProcessed': true,
            'tag': 'span',
            'children': [
                {
                    'expression': '_s(item)',
                    'text': '{{item}}',
                    'static': false
                }
            ]
        }
    ]
}

```

### 3、generate

generate 会将 AST 转化成 render funtion 字符串，最终得到 render 的字符串以及 staticRenderFns 字符串。

```
function generate (rootAst) {
    const code = rootAst ? genElement(rootAst) : '_c("div")'
    return {
        render: `with(this){return ${code}}`,
    }
}
```

generate 函数是将我们上面生成好的 AST（抽象语法树）作为入参，最后返回一个 render 字符串。

其中  render 字符串里面有个js关键字 [with](http://www.w3school.com.cn/js/pro_js_statements_with.asp)，with 用于指定作用域用的。 那返回的 render 属性是个字符串怎么执行呢， js 有个 [eval() 函数](http://www.w3school.com.cn/js/jsref_eval.asp) 可将字符串当做脚本来执行。

可以结合上面那几个步骤 parse、optimize 来分析 generate 的工作大致过程是这样的：

![img2](./image/img2.png)

流程图最后一步的 with 函数的 _c，_l 到底是什么？其实他们是 Vue.js 对一些函数的简写，比如说 _c 对应的是 createElement 这个函数。执行 with 函数会返回 Virtual DOM，这个放在下一节讲。


其中 generate 函数里值得一提的是对 vue 指令 v-if 、v-for 的解析

> genIf

```
function genIf (el) {
    el.ifProcessed = true;
    if (!el.ifConditions.length) {
        return '_e()';
    }
    return `(${el.ifConditions[0].exp})?${genElement(el.ifConditions[0].block)}: _e()`
}
```

> genFor

```
function genFor (el) {
    el.forProcessed = true;

    const exp = el.for;
    const alias = el.alias;
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';

    return `_l((${exp}),` +
        `function(${alias}${iterator1}${iterator2}){` +
        `return ${genElement(el)}` +
    '})';
}
```

## 六、diff 及 patch 机制

patch 机制对应文章开头内部流程图的第5点 视图更新机制。vue有一套高效的视图更新机制，也就是 patch 的核心算法 diff 算法。diff 算法的过程就是两个新老 VNode 节点的比较过程。

由于这部分内容过去复杂，自己也还在研究，放在下一章节讲，没时间的话也有可能有不讲。。。


## 总结

