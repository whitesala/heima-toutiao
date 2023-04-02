<template>
  <div class="home-container">
    <!-- 顶部内容部分 -->
    <van-nav-bar title="首页" fixed>
      <template #left>
        <img src="../../assets/logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右边的搜索框 -->
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>

    <!-- 滚动导航栏和内容列表 -->
    <!-- sticky表示页面纵向滚动时实现分类列表吸顶的效果 -->
    <!-- 如果单位为px，吸顶距离不会跟随屏幕的缩放适配，优化会很差，需要将px转为rem单位，这样吸顶距离会跟随屏幕缩放程度适配 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">{{ item.name }} </van-tab>
    </van-tabs>

    <!-- 添加分离导航的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
// 用户选择的分类列表频道
import { getUserChannelAPI } from '@/api/homeAPI'

export default {
  name: 'HMhome',
  data() {
    return {
      active: 0,
      // 用来接收存储api传来的分类频道列表
      userChannel: []
    }
  },
  created() {
    this.initChannel()
  },
  methods: {
    // 初始化分类频道列表
    async initChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
        console.log(await getUserChannelAPI())
        console.log(res)
        console.log(this.userChannel)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  padding: 46px 0 50px 0;
}
// logo 样式
.logo {
  height: 80%;
}
// 添加分类导航的小图标定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>
