webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description: 模块 a
 * @author: zengtiansheng
 * @update: 2017/10/17
 */
exports.default = {
    funA: function funA() {
        console.log('...module a ......');
        return 233;
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description: 模块 a
 * @author: zengtiansheng
 * @update: 2017/10/17
 */
exports.default = {
    funA: function funA() {
        console.log('...module a ......');
        return 233;
    },
    funB: function funB() {
        console.log('...module a ......');
        return 233;
    }
};

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(1);


/***/ })
],[5]);