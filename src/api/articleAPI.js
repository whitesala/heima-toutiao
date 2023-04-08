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

// 文章评论的API
export const getCmtListAPI = (artId, offset) => {
  return articleRequest.get('/v1_0/comments', {
    params: {
      // type在这里只能为a或c
      // a表示对文章的评论列表，其对应下面的source是文章id
      // 如果是c类型，则这里要传递评论的id
      type: 'a',
      source: artId,
      offset
    }
  })
}

// 喜欢文章评论的API
// 传入文章评论id
export const addLikeCmtAPI = comId => {
  return articleRequest.post('/v1_0/comment/likings', {
    target: comId
  })
}

// 取消喜欢文章评论的API
export const disLikeCmtAPI = comId => {
  return articleRequest.delete(`/v1_0/comment/likings/${comId}`)
}

// 发布文章评论的API
export const pubCmtAPI = (artId, content) => {
  return articleRequest.post('/v1_0/comments', {
    target: artId,
    content
  })
}

// 收藏文章的API
export const collectArtAPI = artId => {
  return articleRequest.post('/v1_0/article/collections', {
    target: artId
  })
}

// 取消收藏文章的API
export const unCollectArtAPI = artId => {
  return articleRequest.post(`/v1_0/article/collections/${artId}`)
}
