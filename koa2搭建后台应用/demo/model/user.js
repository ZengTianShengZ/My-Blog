import mongoose from 'mongoose'
// mongoose.Promise = Promise

const Schema = mongoose.Schema

const userSchema = new Schema({
    openId: String,
    nickName: String,
    avatarUrl: {type: String, default: 'http://oyn5he3v2.bkt.clouddn.com/none_aux.png'},
    gender: {type: Number, default: 1}, // 默认男
    province: String,
    city: String,
    country: String,
}, {timestamps: true})

//创建索引 openId， 1 在这里代表正向排序， -1 就逆向
userSchema.index({openId: 1})

userSchema.statics._findOpenId = async function (openId) {
    const user = await this.findOne({openId: openId})
    return user
}

userSchema.statics._create = async function(data) {
  const create = await this.create(data)
  return create
}

const User = mongoose.model('User', userSchema);

export default User