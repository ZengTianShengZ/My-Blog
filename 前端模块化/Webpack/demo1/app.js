/**
 * @description: app.js
 * @author: zengtiansheng
 * @update: 2017/10/17
 */
import amd from './src/module_amd'
import cmd from './src/module_cmd'
import commonjs from './src/module_commonjs'
import es6 from './src/module_es6'

console.log(amd)        // object
console.log(cmd)        // object
console.log(commonjs)   // object
console.log(es6)        // object

amd.add(11,22)  //33
cmd.add(11,22)  //33
commonjs.add(11,22)  //33
es6.add(11,22)  //33

console.log(amd.add(11,22))
console.log(cmd.add(11,22))
console.log(commonjs.add(11,22))
console.log(es6.add(11,22))

console.log('.....app.js.......')