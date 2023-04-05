import searchRequest from '@/utils/request'

// 获取搜索建议列表数据的API
export const getSuggestListAPI = keyword => {
  return searchRequest.get('/v1_0/suggestion', {
    params: {
      q: keyword
    }
  })
}

// 根据关键词搜索到的文章结果数据
export const getSearchResultAPI = (keyword, page) => {
  return searchRequest.get('/v1_0/search', {
    params: {
      q: keyword,
      page
    }
  })
}
