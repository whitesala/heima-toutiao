import Vue from 'vue'
import VueRouter from 'vue-router'
import { myGetItem } from '@/utils/storage'

// 导入的外部的路由组件
import Login from '@/views/Login/HMLogin.vue'
import Main from '@/views/Main/HMMain.vue'
import Home from '@/views/Home/HMHome.vue'
import User from '@/views/User/HMUser.vue'
import Search from '@/views/Search/HMSearch.vue'
import SearchResult from '@/views/SearchResult/HMSearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/HMArticleDetail.vue'
import UserEdit from '@/views/userEdit/HMUserEdit.vue'
import ChatRobot from '@/views/ChatRobot/HMChatRobot.vue'

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
    ],
    meta: {
      // 主要的目的是记录进度条与顶部的位置,isRecord没有实际使用意义
      isRecord: true,
      top: 0
    }
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果组件的路由规则
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  // 文章详情页的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'article-detail', props: true },
  // 编辑用户信息的组件路由规则
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  // 机器人聊天的界面
  { path: '/user/chat-robot', component: ChatRobot, name: 'chat-robot' }
]

// 实例化路由对象
const router = new VueRouter({
  routes,
  // 控制页面的滚动行为
  scrollBehavior(to, from, savedPosition) {
    // 将记录的滚动条距离顶部的位置return出去
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: to.meta.top || 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/home') {
    const token = myGetItem('state')
    token ? next() : next('/login')
  } else {
    next()
  }
})

export default router
