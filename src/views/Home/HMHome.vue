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
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">

        <!-- 文章列表模块 -->
        <keep-alive include="ArtList">
          <ArtList :channelId="item.id"></ArtList>
        </keep-alive>
      </van-tab>

      <!-- 频道管理的小图标 -->
      <van-icon name="plus" size="16" class="plus" />
    </van-tabs>
  </div>

</template>

<script>
// 导入api接口模块
import { getUserChannelAPI } from '@/api/homeAPI'
import ArtList from '@/components/ArtList/HMArtList.vue'
// 导入lodash模块
import _ from 'lodash'
// 定义一个fn储存页面移动的距离,初始为空
const fn = null

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
  components: {
    ArtList
  },
  created() {
    this.initUserChannel()
  },
  // 钩子函数,组件被激活时添加滚动时的监听,fn存储移动距离
  activated() {
    const fn = this.recordTopHandler()
    window.addEventListener('scroll', fn)
  },
  // 组件界面被缓存时移除滚动的事件监听
  deactivated() {
    window.removeEventListener('scroll', fn)
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
    },

    // 用来记录窗口滑动的距离
    // 只要一滚动,就将滚动后滚动条与顶部的距离记录到路由的meta元信息的top里面
    recordTopHandler() {
      // debounce是lodash里的防抖函数,可以提高性能
      return _.debounce(() => {
        // meta挂载在全局vue对象里面的$route里面,通过this.$route.meta.top访问到top并将滚动距离window.scrollY赋值给top
        this.$route.meta.top = window.scrollY
      },
      // 延迟时间(wait)
      50,
      // options里的trailing选项,true表示结束后调用
      { trailing: true }
      )
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
