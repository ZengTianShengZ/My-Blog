import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vDragging from './directive/vDragging'

Vue.config.productionTip = false
Vue.use(vDragging)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
