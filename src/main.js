import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入所有的vant组件,基于vant组件的懒加载Lazyload、amfe-flexible
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
import 'amfe-flexible'

// dayjs核心模块
import dayjs from 'dayjs'
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'

// 在Vue上注册Vant
Vue.use(Vant)
// 注册Lazyload为全局对象
Vue.use(Lazyload)

// 配置"计算相对时间"的插件
dayjs.extend(relativeTime)
// 配置中文语言包
dayjs.locale(zh)

Vue.config.productionTip = false

// 配置定义格式化时间的全局过滤器
Vue.filter('dateFormat', dt => {
  // 调用dayjs()得到当前时间
  // .to() 方法的返回值，是计算出来的“相对时间”
  return dayjs().to(dt)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
