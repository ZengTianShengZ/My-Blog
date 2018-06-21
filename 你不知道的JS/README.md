
### 第一章： 作用域是什么

#### 1、 编译原理

JavaScript 被列为 ‘动态’ 或 ‘解释执行’ 语言，于其他传统语言（如 java）不同的是，JavaScript是边编译边执行的。
一段源码在执行前会经历三个步骤： `分词/词法分析` -> `解析/语法分析` -> `代码生成`

  - 分词/词法分析
  这个过程将字符串分解成词法单元，如 var a = 2; 会被分解成词法单元 var、 a、 = 、2、;。空格一般没意义会被忽略

  - 解析/语法分析
  这个过程会将词法单元转换成‘抽象语法树’（Abstract Syntax Tree,AST）。
  如  var a = 2; 对应的 抽象语法树 如下, 可通过 [在线可视化AST](https://astexplorer.net/) 网址去分析

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
  将 AST 转换成可执行的代码，存放于内存中，分配内存和转化为一些机器指令

#### 2、理解作用域

其实结合上面提到的编译原理，作用域就好理解了。作用域就是当前执行代码对这些标识符的访问权限。
编译器会在当前作用域中声明一个变量，运行时引擎会去作用域中查找该变量（其实就是一个寻址的过程），
如果找到该变量就可以操作变量，找不到就往上一层作用域找（作用域链的概念），或者返回 null





