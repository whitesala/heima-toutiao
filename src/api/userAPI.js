import requests from '@/utils/request'

// 登陆的api接口
export const loginAPI = data => {
  return requests.post('/v1_0/authorizations', data)
}
