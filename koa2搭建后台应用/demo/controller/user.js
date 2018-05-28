import userModel from '../model/user'

const _errData = (msg = '服务器错误', code = 5000) => {
  return {
    msg,
    code,
    success: false,
  }
}
const _successData = (data ={}, msg = '', code = 2000) => {
  return {
    data,
    msg,
    code,
    success: true,
  }
}

export const getUser = async (ctx) => {
  const {openId} = ctx.params
  if (!openId) {
    ctx.body =  _errData('openId 参数不存在')
    return
  }
  try {
    const resData = await userModel._findOpenId(openId)
    if (resData) {
      ctx.body = _successData(resData)
    } else {
      ctx.body =  _errData('用户不存在', 4000)
    }
  } catch (err) {
    console.log(err)
    ctx.body =  _errData()
  }
}

export const createtUser = async (ctx) => {
  const data = ctx.request.body
  const resData = await userModel._create(data)
  if (resData.openId) {
    ctx.body = _successData(resData)
  } else {
    ctx.body =  _errData('用户创建失败', 4000)
  }
}