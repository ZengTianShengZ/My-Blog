function foo() {
  var result = []
  for (let i = 0; i < 10; i++) {
    result[i] = function () {
      return i
    }
  }
  return result
}
var result = foo()
console.log(result[0]());
console.log(result[1]());
console.log(result[2]());
console.log(result[3]());
console.log(result[4]());

function foo() {
  var result = []
  for (var i = 0; i < 10; i++) {
    result[i] = function (num) {
      return function () {
        return num
      }
    }(i)
  }
  return result
}
var result = foo()
console.log(result[0]());
console.log(result[1]());
console.log(result[2]());
console.log(result[3]());
console.log(result[4]());
// try {
//   undefined()
// } catch (error) {
//   for (var i = 0; i < 10; i++) {
//     console.log('i=', i);
//   }
// }
// console.log('输出', i);
// {
// let name = '曾田生'
// }

// console.log(name);


