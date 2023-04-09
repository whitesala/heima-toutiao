import userRequests from '@/utils/request'
import axios from 'axios'

// 登陆的api接口
export const loginAPI = data => {
  return userRequests.post('/v1_0/authorizations', data)
}

// 请求用户信息的接口
export const getUserInfoAPI = () => {
  return userRequests.get('/v1_0/user')
}

// 请求用户简介的API
export const getUserProfileAPI = () => {
  return userRequests.get('/v1_0/user/profile')
}

// 请求修改用户简介的API
// 这里的obj是用户简介信息的对象，可能的格式数值有: {name: 'xxx}或者{birthday: 20xx-xx-xx}
export const updateUserProfileAPI = obj => {
  return userRequests.patch('/v1_0/user/profile', obj)
}

// 修改头像的API(fd表示FormData格式的表单数据)
export const updateUserAvatarAPI = fd => {
  return userRequests.patch('/v1_0/user/photo', fd)
}

// 刷新token的API
// 在请求新 Token 时，不要基于 /src/utils/request.js 模块中的 instance 发起请求，
// 因为 instance 发起请求时，默认携带的 Authorization 值为 tokenInfo.token 属性！！！
export const exchangeTokenAPI = refreshToken => {
  return axios({
    method: 'PUT',
    // 这里必须是完整的url地址
    url: 'http://toutiao.itheima.net/v1_0/authorizations',
    headers: {
      // 请求头中携带Authorization身份认证字段
      Authorization: 'Bearer ' + refreshToken
    }
  })
}
