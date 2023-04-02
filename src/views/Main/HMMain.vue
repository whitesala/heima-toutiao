<template>
  <div>
    <!-- 组件内容展示 -->
    <router-view></router-view>
    <!-- 底部的 TabBar -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/home/user">我的</van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
export default {
  name: 'HMMain'
}
</script>

<style lang="less" scoped>

</style>
