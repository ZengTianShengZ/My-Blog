// document.body.addEnentListener('click', function (params) {
//   console.log('on click');
// }, false)

// document.body.click(); // 模拟用户点击


// const event = {
//   clientList: [],
//   listen(key, fn) {
//     if (!this.clientList[key]) {
//       this.clientList[key] = [];
//     }
//     this.clientList[key].push(fn); // 订阅的消息加进缓存列表
//   },
//   tigger() {
//     const key = Array.prototype.shift.call(arguments);
//     const fns = this.clientList[key];
//     if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
//       return false;
//     }
//     for (let i = 0, fn = null; fn = fns[i++];) {
//       fn.apply(this.arguments);
//     }
//   }
// }
// event.listen('1点', function (doing) {
//   console.log(doing);
// })
// event.listen('2点', function (doing) {
//   console.log(doing);
// })
// event.tigger('1点', '吃饭') // 吃饭
// event.tigger('2点', '睡觉') // 睡觉


// const command = function () {
//   return {
//     commandList: [],
//     add(command) {
//       this.commandList.push(command)
//     },
//     execute() {
//       for (var i = 0, command; command = this.commandList[i++];) {
//         command.execute();
//       }
//     }
//   }
// }
// const command1 = {
//   execute() {
//     console.log('----command1---');
//   }
// }
// const command2 = {
//   execute() {
//     console.log('----command2---');
//   }
// }
// const cmd = command()
// cmd.add(command1)
// cmd.add(command2)
// cmd.execute()

// var Model = function (sex, underwear) {
//   this.sex = sex;
//   this.underwear = underwear;
// }
// Model.prototype.takePhoto = function () {
//   console.log('sex=' + this.sex + 'underwear=' + this.underwear)
// }
// for (var i = 1; i <= 50; i++) {
//   var maleModel = new Model('male', 'underwear' + i)
//   maleModel.takePhoto();
// }
// for (var i = 1; i <= 50; i++) {
//   var maleModel = new Model('female', 'underwear' + i)
//   femaleModel.takePhoto();
// }

// var Model = function (sex) {
//   this.sex = sex;
// }
// Model.prototype.takePhoto = function () {
//   console.log('sex=' + this.sex + 'underwear=' + this.underwear)
// }


// var maleModel = new Model('male'),
//   female = new Model('female');
// for (var i = 1; i <= 50; i++) {
//   maleModel.underwear = 'underwear' + i;
//   maleModel.takePhoto();
// }
// for (var i = 1; i <= 50; i++) {
//   female.underwear = 'underwear' + i;
//   femaleModel.takePhoto();
// }

const Plane = {
  fire() {
    console.log('-----发射子弹');
  }
}
Plane.fire() // -----发射子弹

// 升级后

const fireAtom = function () {
  console.log('-----发射原子弹');
}

Function.prototype.after = function (afterFn) {
  const _this = this;
  return function () {
    const ret = _this.apply(this, arguments);
    afterFn.apply(this, arguments)
    return ret
  }
}

Plane.fire.after(fireAtom)()