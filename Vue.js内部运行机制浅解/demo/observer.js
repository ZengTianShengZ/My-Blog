// Object.defineProperty(obj, prop, descriptor)
// enumerable，属性是否可枚举，默认 false。
// configurable，属性是否可以被修改或者删除，默认 false。
// get，获取属性的方法。
// set，设置属性的方法。
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty



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