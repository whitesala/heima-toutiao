<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar title="首页" fixed>
      <!-- 左侧图标 -->
      <template #left>
        <img src="../../assets/logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧搜索 -->
      <template #right>
        <van-icon name="search" color="black" size="18" />
      </template>
    </van-nav-bar>
    <!-- 分类频道列表 -->
    <!-- v-model绑定active，默认是激活第一个 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">{{ item.name }}</van-tab>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
</van-tabs>
  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeAPI'
export default {
  name: 'HMHome',
  data() {
    return {
      // 默认激活显示的为第一个
      active: 0,
      // 定义用户分类频道列表，接收API传来的值
      userChannel: []
    }
  },
  created() {
    this.initUserChannel()
  },

  methods: {
    async initUserChannel() {
    // 调用 API 接口
      const { data: res } = await getUserChannelAPI()
      // 判断请求是否成功
      if (res.message === 'OK') {
      // 为用户的频道列表赋值
        this.userChannel = res.data.channels
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 组件外层容器的样式
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
}
// logo 样式
.logo {
  height: 80%;
}
// 频道管理小图标的定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}

</style>
