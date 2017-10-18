/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/**
 * @description: module-cmd
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
    var add = function add(x, y) {
        return x + y;
    };
    // 或者通过 module.exports 提供整个接口
    module.exports = { add: add };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _module_amd = __webpack_require__(2);

var _module_amd2 = _interopRequireDefault(_module_amd);

var _module_cmd = __webpack_require__(0);

var _module_cmd2 = _interopRequireDefault(_module_cmd);

var _module_commonjs = __webpack_require__(3);

var _module_commonjs2 = _interopRequireDefault(_module_commonjs);

var _module_es = __webpack_require__(4);

var _module_es2 = _interopRequireDefault(_module_es);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description: app.js
 * @author: zengtiansheng
 * @update: 2017/10/17
 */
console.log(_module_amd2.default); // object
console.log(_module_cmd2.default); // object
console.log(_module_commonjs2.default); // object
console.log(_module_es2.default); // object

_module_amd2.default.add(11, 22); //33
_module_cmd2.default.add(11, 22); //33
_module_commonjs2.default.add(11, 22); //33
_module_es2.default.add(11, 22); //33

console.log(_module_amd2.default.add(11, 22));
console.log(_module_cmd2.default.add(11, 22));
console.log(_module_commonjs2.default.add(11, 22));
console.log(_module_es2.default.add(11, 22));

console.log('.....app.js.......');

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/**
 * @description: module-amd
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
    var add = function add(x, y) {
        return x + y;
    };
    return {
        add: add
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _module_cmd = __webpack_require__(0);

var _module_cmd2 = _interopRequireDefault(_module_cmd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var add = function add(x, y) {
  return x + y;
}; /**
    * @description: module-commonjs
    * @author: zengtiansheng
    * @update: 2017/10/16
    */

exports.add = add;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description: module-es6
 * @author: zengtiansheng
 * @update: 2017/10/16
 */
var add = function add(x, y) {
    return x + y;
};
exports.default = {
    add: add
};

/***/ })
/******/ ]);