<template>
  <div class="search-result-container">
    <!-- 点击实现后退功能 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed
/>
    <!-- 上拉加载更多 -->
    <van-list v-model="loading" :finished="finished" finished-text="实在没有更多啦>~~<" @load="onLoad" :immediate-check="false">
      <!-- 文章item项 -->
      <!-- :closeable="false"表示当在搜索结果组件里面使用展示ArtItem的时候其反馈的图标隐藏 -->
      <ArtItem v-for="item in searchResultList" :key="item.art_id.toString()" :article="item" :closeable="false"></ArtItem>
    </van-list>

  </div>
</template>

<script>
// 按需导入搜索结果的API
import { getSearchResultAPI } from '@/api/searchAPI'
// 导入文章的item项组件
import ArtItem from '@/components/ArtItem/HMArtItem.vue'

export default {
  name: 'SearchResult',
  data() {
    return {
      // 搜索结果页页码值
      page: 1,
      // 搜索结果的数组
      searchResultList: [],

      // 是否正在进行加载
      loading: false,
      // 是否完成所有数据加载
      finished: false
    }
  },
  props: {
    // 接收由路由规则传来的kw关键ci
    kw: {
      type: String,
      required: true
    }
  },
  components: {
    ArtItem
  },
  created() {
    // 调用初始化请求搜索列表的方法
    this.initSearchResultList()
  },
  watch: {
    // 实现searchResult组件的状态保持
    // 侦听kw的变化来动态请求文章的搜索结果
    kw() {
      this.page = 1
      // 侦听到关键词变化后清空原来关键词搜索结果
      this.searchResultList = []
      this.loading = false
      this.finished = false
      // 重新请求新关键词对应的文章搜索结果列表
      this.initSearchResultList()
    }
  },
  methods: {
    async initSearchResultList() {
      const { data: res } = await getSearchResultAPI(this.kw, this.page)
      if (res.message === 'OK') {
        this.searchResultList = [...this.searchResultList, ...res.data.results]
        this.loading = false
        if (res.data.results.length === 0) this.finished = true
        this.page += 1
      }
    },
    onLoad() {
      this.initSearchResultList()
    }
  },

  // 声明 beforeRouteLeave组件内的守卫，用来记录当前组件在纵向上滚动的距离
  beforeRouteLeave(from, to, next) {
    from.meta.top = window.scrollY
    setTimeout(() => {
      next()
    }, 0)
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}

</style>
