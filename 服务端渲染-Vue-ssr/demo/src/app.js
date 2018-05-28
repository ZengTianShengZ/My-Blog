/**
 * @description: 文件或模块描述
 * @author: zengtiansheng
 * @update: 2018/3/2
 */
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

export function createApp (ssrContext) {
    const router = createRouter()
    const app = new Vue({
        router,
        ssrContext,
        render: h => h(App)
    })
    return { app, router }
}
