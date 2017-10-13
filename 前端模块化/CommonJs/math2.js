var math2 = function() {
  this.add = function(a, b) {
    return a + b;
  };
  this.minus = function(a, b) {
    return a - b;
  };
};
// add方法 会被忽略
exports.add = function(a, b) {
  return a + b;
};

module.exports = new math2();
