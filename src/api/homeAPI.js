import homeRequest from '@/utils/request'

// 获取频道分类列表
export const getUserChannelAPI = () => {
  return homeRequest.get('/v1_0/user/channels')
}

// 获取文章列表,id指频道分类的id，time表示时间戳
export const getArtListAPI = (channelId, time) => {
  return homeRequest.get('/v1_0/articles', {
    // 将访问的参数传递进去
    params: {
      channel_id: channelId,
      timestamp: time
    }
  })
}

// 设置不感兴趣文章的API
export const dislikeArtAPI = (targetId) => {
  return homeRequest.post('/v1_0/article/dislikes', {
    target: targetId
  })
}

// 举报文章API
export const reportArtAPI = (targetId, type, remark) => {
  return homeRequest.post('/v1_0/article/reports', {
    target: targetId,
    type: type,
    remark: remark
  })
}

// 获取所有频道分类列表的API
export const getAllChannelAPI = () => {
  return homeRequest.get('/v1_0/channels')
}

// 将用户的频道分类数据存储到数据库
export const updateUserChannelAPI = channels => {
  return homeRequest.put('/v1_0/user/channels', {
    channels
  })
}
