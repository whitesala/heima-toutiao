import Vue from 'vue'
import VueRouter from 'vue-router'
// import { myGetItem } from '@/utils/storage'
import store from '@/store/index'

// 导入的外部的路由组件
// 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效
// import Login from '@/views/Login/HMLogin.vue'
// 对应修改原来导入路由的方式
const Login = () => import('@/views/Login/HMLogin.vue')
const Main = () => import('@/views/Main/HMMain.vue')
const Home = () => import('@/views/Home/HMHome.vue')
const User = () => import('@/views/User/HMUser.vue')
const Search = () => import('@/views/Search/HMSearch.vue')
const SearchResult = () => import('@/views/SearchResult/HMSearchResult.vue')
const ArticleDetail = () => import('@/views/ArticleDetail/HMArticleDetail.vue')
const UserEdit = () => import('@/views/userEdit/HMUserEdit.vue')
const ChatRobot = () => import('@/views/ChatRobot/HMChatRobot.vue')

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
      {
        path: '',
        component: Home,
        name: 'home',
        meta: {
        // 主要的目的是记录进度条与顶部的位置,isRecord没有实际使用意义
          isRecord: true,
          top: 0
        }
      },
      { path: 'user', component: User, name: 'user' }
    ]
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果组件的路由规则
  {
    path: '/search/:kw',
    component: SearchResult,
    name: 'search-result',
    props: true,
    // 用于记录浏览的位置
    meta: { isRecord: true, top: 0 }
  },
  // 文章详情页的路由规则
  {
    path: '/article/:id',
    component: ArticleDetail,
    name: 'article-detail',
    props: true,
    // 用于记录浏览的位置
    meta: { isRecord: true, top: 0 }
  },
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

// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})

// 所有需要权限的页面的数组，凡是跳转这些页面都想需要先检验有无权限，无则跳转到登录页面
const pagePathArr = ['/home', '/home/user', '/user/edit', '/user/chatRobot']

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 获取store里面的token值
    // store.state.tokenIbfo要么是空对象要么是登陆后包含{token,refresh_token}的对象
    const token = store.state.tokenInfo.token
    // 需要权限的页面，没有登录，强制跳转到登录页，并携带路由的 "query 查询参数"
    token ? next() : next(`/login?pre=${to.fullPath}`)
  } else {
    // 访问的是无权限的路由地址直接放行
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
