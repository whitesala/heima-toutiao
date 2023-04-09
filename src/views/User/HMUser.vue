<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{ userInfo.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>

      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link @click="$router.push
      ({name: 'user-edit'})"/>
      <van-cell icon="chat-o" title="小思同学" is-link @click="$router.push({name : 'chat-robot'})"/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout"/>
    </van-cell-group>
  </div>
</template>

<script>
// 按需导入vuex的辅助函数
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'HMUser',
  computed: {
    // 将vuex容器指定名称的state数据映射到组件中使用
    ...mapState(['userInfo'])
  },
  methods: {
    // 从vuex中将Actions里的指定方法映射到组件中使用
    ...mapActions(['initUserInfo']),
    // 从vuex中将Mutations里的指定方法clearState映射到组件中使用
    ...mapMutations(['clearState']),
    // 监听退出的事件
    async logout() {
      // console.log('退出')
      const confirmResult = await this.$dialog
        .confirm({
          title: '提示',
          message: '确认退出登录'
        })
        .catch(err => {
          // 将err return给了confirmResult
          return err
        })

      // 点击取消不执行后续操作
      if (confirmResult === 'cancel') return undefined

      // 点击确定退出实现退出登录
      // 清除vuex里面的tokenInfo和userInfo信息
      // 清空本地中的信息
      this.clearState()
      // 跳转到登录页
      this.$router.push('/login')
    }
  },
  created() {
    // 初始化用户界面
    this.initUserInfo()
  }

}
</script>

<style lang="less" scoped>
.user-container {
  // 用户基本信息
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      // 头像
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      // 用户名
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
