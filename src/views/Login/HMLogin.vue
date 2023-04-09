<template>
  <div class="login-container">
    <!-- 基于vant的NavBar导航栏组件渲染登陆的头部区域 -->
    <van-nav-bar title="请登录" fixed/>

    <!-- 登录表单 -->
    <van-form @submit="login">
      <!-- 手机号码 -->
      <van-field v-model="form.mobile" type="tel" label="手机号码" placeholder="请输入手机号码" required :rules="rules.mobile"></van-field>

      <!-- 登陆密码 -->
      <van-field v-model="form.code" type="password" label="登陆密码" placeholder="请输入密码" required :rules="rules.code"></van-field>

      <!-- 提交按钮 -->
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>

  </div>

</template>

<script>
// 使用解构的方式按需导入API接口模块
import { loginAPI } from '@/api/userAPI.js'
// 按需导入vuex的辅助方法
import { mapMutations } from 'vuex'

export default {
  // login的name名称
  name: 'HMLogin',
  data() {
    return {
      // 登录表单的数据，最终双向绑定到form这个数据对象上
      form: {
        // 手机号码
        mobile: '',
        // 密码
        code: '' // 统一为246810

      },
      rules: {
        // 需满足以下两个验证才能通过
        mobile: [
          { required: true, message: '请填写手机号码', trigger: 'onBlur' },
          { pattern: /^1\d{10}$/, message: '请填写正确的手机号', trigger: 'onBlur' }
        ],
        code: [{ required: true, message: '请填写正确的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    // 映射mutations中的方法updateTokenInfo
    ...mapMutations(['updateTokenInfo']),

    // 监听表单提交事件
    async login() {
      // 将表格中的数据传入
      const { data: res } = await loginAPI(this.form)

      // 判断返回的信息是否为OK
      if (res.message === 'OK') {
        // 将登陆成功的结果存储到vuex里面
        this.updateTokenInfo(res.data)
        // 对登录前用户访问的有权限的地址进行保存，如果有访问则保存访问的地址，否则没有访问即this.$route.query.pre为false时则默认为'/'
        const navPath = this.$route.query.pre || '/'
        this.$router.replace(navPath)
      }
    }

  }
}
</script>

<style lang="less" scoped>
.login-container{
  padding-top: 46px;
}

// .van-field input::-webkit-input-placeholder {
//   color: #909399 !important;
//   opacity: 1 !important;
// }
</style>
