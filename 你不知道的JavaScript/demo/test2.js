// 'use strict'
// function foo() {
//   this.bar()
// }
// function bar() {
//   console.log('---bar---');
// }
// foo()


// function foo() {
//   console.log(this.a);
// }
// var obj1 = {
//   a: 1
// }
// var obj2 = {
//   a: 2
// }
// var obj3 = {
//   a: 3
// }
// foo.call(obj1) // 1
// foo.apply(obj2) // 2
// foo.bind(obj3)() // 3


// function foo(a) {
//   this.a = a
// }
// var bar = new foo(1)
// console.log(bar.a);

// var arr = ['foo', 'bar']
// arr.baz = 'baz'
// console.log(arr.baz);

// var obj = {}
// // console.log(Object.getOwnPropertyDescriptor(obj, 'a'));

// Object.defineProperty(obj, 'a', {
//   value: 1,
//   writable: false,
//   enumerable: true,
//   configurable: true
// })

// obj.a = 2
// console.log(obj.a);

var obj = {
  get a() {
    return this._a_
  },
  set a(val) {
    this._a_ = val * 2
  }
}

obj.a = 2
console.log(obj.a);


