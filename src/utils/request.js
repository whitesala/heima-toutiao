// 导入axios模块
import axios from 'axios'
// 导入vuex模块
import store from '@/store/index'

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
    console.log(config)
    // 记得需要return，否则程序还会继续往下执行
    return config
  },
  // 错误时抛出错误（还没有发出），这里使用function需要加上return
  error => Promise.reject(error)
)

// 将requests共享出去
export default requests
