import homeRequest from '@/utils/request'

export const getUserChannelAPI = () => {
  return homeRequest.get('/v1_0/user/channels')
}
