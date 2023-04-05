import articleRequest from '@/utils/request'

// 文章详情页的API
export const getArticleDetailAPI = artId => {
  return articleRequest.get(`/v1_0/articles/${artId}`)
}

// 关注作者的API
export const setFollowAPI = autId => {
  return articleRequest.post('/v1_0/user/followings', {
    target: autId
  })
}

// 取关作者的API
export const setUnFollowAPI = autId => {
  return articleRequest.delete(`/v1_0/user/followings/${autId}`)
}

// 文章点赞的API
export const setLikeAPI = artId => {
  return articleRequest.post('/v1_0/article/likings', {
    target: artId
  })
}

// 文章取消点赞的API
export const setDislikeAPI = artId => {
  return articleRequest.delete(`/v1_0/article/likings/${artId}`)
}
