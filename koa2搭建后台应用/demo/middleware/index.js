export function errorMiddleware () {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err)
      ctx.body = {
        msg: '服务器错误',
        code: 5000,
        success: false,
      }
    }
  };
};