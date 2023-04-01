import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入所有的vant组件、amfe-flexible
import Vant from 'vant'
import 'vant/lib/index.less'
import 'amfe-flexible'

// 在Vue上注册Vant
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
