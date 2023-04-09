// 导入axios模块
import axios from 'axios'
// 导入router实例对象
import router from '@/router/index'
// 导入vuex模块
import store from '@/store/index'
import { Toast } from 'vant'
// 按需导入换取 token 的 API
import { exchangeTokenAPI } from '@/api/userAPI.js'

// 调用axios.create()方法创建axios的实例化对象
const requests = axios.create({
  // 请求根路径
  baseURL: 'http://toutiao.itheima.net'
})

// 在请求拦截器中的store.state中获取到tokenInfo的token值
requests.interceptors.request.use(
  config => {
    // 获取tokenInfo里的token值
    const tokenStr = store.state.tokenInfo.token
    // 判断tokenStr是否为空
    // 若是非空则为为这次请求的请求头添加 Authorization 身份认证字段
    if (tokenStr) config.headers.Authorization = `Bearer ${tokenStr}`
    // console.log(config)
    // 记得需要return，否则程序还会继续往下执行
    return config
  },
  // 错误时抛出错误（还没有发出），这里使用function需要加上return
  error => Promise.reject(error)
)

// 响应拦截器
requests.interceptors.response.use(
  response => {
    // 隐藏loading提示效果
    Toast.clear()
    return response
  },
  async error => {
    Toast.clear()

    // 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo

    // 判断token是否过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      try {
        // TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
        const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)

        // TODO2：TODO: 更新 Store 中的 Token
        store.commit('updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })

        // 重新调用刚才“请求未遂”的接口
        // 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
        return requests(error.config)
      } catch {
        // token和refresh_token都失效

        // 清空vuex和localStorage
        store.commit('clearState')
        // 强制跳转到登录页
        router.replace('/login?pre=' + router.currentRoute.fullPath)
      }
    }
    return Promise.reject(error)
  }
)

// 将requests共享出去
export default requests
