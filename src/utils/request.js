import axios from 'axios'

// 调用axios.create()方法创建axios的实例化对象
const requests = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000',
  timeout: 5000
})

export default requests
