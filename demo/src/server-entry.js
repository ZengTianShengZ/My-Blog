/**
 * @description: 文件或模块描述
 * @author: zengtiansheng
 * @update: 2018/3/2
 */
import { createApp } from './app'

// const isDev = process.env.NODE_ENV !== 'production'

export default context => {
    return new Promise((resolve, reject) => {
        const { app, router } = createApp(context)
        router.push(context.url)
        router.onReady(() => {
            resolve(app)
        }, reject)
    })
}
