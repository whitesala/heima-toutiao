import homeRequest from '@/utils/request'

export const getUserChannelAPI = () => {
  return homeRequest.get('/v1_0/user/channels')
}

// id指频道分类的id，time表示时间戳
export const getArtListAPI = (channelId, time) => {
  return homeRequest.get('/v1_0/articles', {
    // 将访问的参数传递进去
    params: {
      channel_id: channelId,
      timestamp: time
    }
  })
}
