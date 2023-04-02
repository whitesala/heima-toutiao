import Vue from 'vue'
import VueRouter from 'vue-router'
import { myGetItem } from '@/utils/storage'

// 导入的外部的路由组件
import Login from '@/views/Login/HMLogin.vue'
import Main from '@/views/Main/HMMain.vue'
import Home from '@/views/Home/HMHome.vue'
import User from '@/views/User/HMUser.vue'

Vue.use(VueRouter)

const routes = [
  // 一开始进入页面重定向到登录界面
  { path: '/', redirect: '/home' },
  // 登陆的路由规则
  { path: '/login', component: Login, name: 'login' },
  // 主页的路由规则
  {
    path: '/home',
    component: Main,
    children: [
      // path 为"空字符串"的子路由规则，叫做"默认子路由"
      { path: '', component: Home, name: 'home' },
      { path: 'user', component: User, name: 'user' }
    ]
  }
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
