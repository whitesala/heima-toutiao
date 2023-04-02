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
  { path: '/login', component: Login },
  // 主页面的路由规则
  {
    path: '/home',
    component: Main,
    children: [
      // 首页的路由规则,子路由默认页面的path路径为空
      // 这里另外可以使用redirect重定向来指定默认子路由
      { path: '', component: Home },
      { path: 'user', component: User }
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
