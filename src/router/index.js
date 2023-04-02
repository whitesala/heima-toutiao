import Vue from 'vue'
import VueRouter from 'vue-router'
import { myGetItem } from '@/utils/storage'

// 导入的外部的路由组件
import Login from '@/views/Login/HMLogin.vue'
import Main from '@/views/Main/HMMain.vue'

Vue.use(VueRouter)

const routes = [
  // 一开始进入页面重定向到登录界面
  { path: '/', redirect: '/home' },
  // 登陆的路由规则
  { path: '/login', component: Login },
  // 主页的路由规则
  { path: '/home', component: Main }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/home') {
    const token = myGetItem('state')
    token ? next() : next('/login')
  } else {
    next()
  }
})

export default router
