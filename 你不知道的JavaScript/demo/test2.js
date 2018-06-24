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


function foo(a) {
  this.a = a
}
var bar = new foo(1)
console.log(bar.a);
