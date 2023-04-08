<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <!-- 在HMArticleDetail.vue 组件刚加载时，如果网速较慢，则 data 中的 article 等于 null。为了防止 DOM 闪烁的问题，可以为文章信息区域的 div 应用 v-if 指令 -->
    <div class="article-container" v-if="articleDetail">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ articleDetail.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleDetail.aut_name" :label="articleDetail.pubdate | dateFormat">
        <template #icon>
          <!-- 头像 -->
          <img :src="articleDetail.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button type="info" size="mini" v-if="articleDetail.is_followed" @click="setUnFollow">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="setFollow">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleDetail.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="articleDetail.attitude === 1" @click="setDislike">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="setLike">点赞</van-button>
      </div>
    </div>

    <!-- 文章评论区域 -->
    <ArtCmt :art-id="id"></ArtCmt>
  </div>
</template>

<script>
// 按需导入文章详情页的API
import { getArticleDetailAPI, setFollowAPI, setUnFollowAPI, setLikeAPI, setDislikeAPI } from '@/api/articleAPI'
import ArtCmt from '@/components/ArtComment/HMArtComment.vue'

export default {
  name: 'ArticleDetail',
  data() {
    return {
      // 文章详情的信息对象
      articleDetail: null
    }
  },
  components: {
    ArtCmt
  },
  // 文章id
  props: ['id'],
  created() {
    this.initArticleDetail()
  },
  methods: {
    // 请求文章详情页
    async initArticleDetail() {
      // 请求文章详情数据
      const { data: res } = await getArticleDetailAPI(this.id)
      if (res.message === 'OK') {
        // console.log(res)
        this.articleDetail = res.data
      }
    },

    // 实现关注的功能
    async setFollow() {
      // 调用关注作者的API
      const { data: res } = await setFollowAPI(this.articleDetail.aut_id)
      if (res.message === 'OK') {
        // 提示用户关注成功
        this.$toast.success('已关注,谢谢支持!')
        // 将is_followed设置为true,手动变更关注状态
        this.articleDetail.is_followed = true
      }
    },

    // 实现取消关注
    async setUnFollow() {
      const res = await setUnFollowAPI(this.articleDetail.aut_id.toString())
      if (res.status === 204) {
        // 提示用户取消关注成功
        this.$toast.success('已取消关注')
        // 将is_followed设置为true,手动变更关注状态
        this.articleDetail.is_followed = false
      }
    },

    // 实现点赞
    async setLike() {
      const { data: res } = await setLikeAPI(this.id)
      if (res.message === 'OK') {
        // 提示用户点赞成功
        this.$toast.success('点赞成功,谢谢支持!')
        // 将attitude设置为1,手动变更点赞状态
        this.articleDetail.attitude = 1
      }
    },

    // 实现取消点赞
    async setDislike() {
      const res = await setDislikeAPI(this.id)
      if (res.status === 204) {
        // 提示用户点赞已经取消
        this.$toast.success('点赞已取消')
        // 将attitude设置为-1,手动变更点赞状态
        this.articleDetail.attitude = -1
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

</style>
