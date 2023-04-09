import Vue from 'vue'
import VueRouter from 'vue-router'
// import { myGetItem } from '@/utils/storage'
import store from '@/store/index'

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

// 所有需要权限的页面的数组，凡是跳转这些页面都想需要先检验有无权限，无则跳转到登录页面
const pagePathArr = ['/home', '/home/user', '/user/edit', '/user/chatRobot']

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    const token = store.state.tokenInfo.token
    // 没有登录，强制跳转到登录页，并携带路由的 "query 查询参数"
    token ? next() : next(`/login?pre=${to.fullPath}`)
  } else {
    next()
  }
})

// 解决vue-Router内部报错问题
// 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush(this, location, onResolve, onReject)
  // 通过catch捕获错误
  return originalPush.call(this, location).catch(err => err)
}

export default router
