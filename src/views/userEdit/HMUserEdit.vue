<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <!-- 用户头像 -->
          <!-- @click="$refs.fileRef.click()"使用ref引用的方式获取到文件选择框 -->
          <van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileRef.click()"/>
          <!-- 自定义头像的文件选择框 -->
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef">
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="onNameCellClick"/>
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="onBirthCellClick"/>
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button :before-close="beforeClose">
      <!-- input-align 文本横向的对其方式 -->
      <van-field v-model.trim="name" placeholder="请输入用户名" input-align="center" maxlength="11" ref="nameRef"/>
    </van-dialog>

    <!-- 修改用户生日的对话框 -->
    <van-action-sheet v-model="showBirthSheet">
      <!-- 基于 Vant 的 DatetimePicker 时间选择 组件，快速渲染选择年月日的事件选择器组件 -->
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" @cancel="showBirthSheet = false" @confirm="updateBirthday"/>
    </van-action-sheet>

  </div>
</template>

<script>
// 按需导入vuex的辅助函数
import { mapActions, mapState } from 'vuex'
// 按需导入user的API方法
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI.js'
// 导入格式化时间的js
import dayjs from 'dayjs'

export default {
  name: 'UserEdit',
  data() {
    return {
      // 是否展示名字的编辑输入弹窗
      showNameDialog: false,
      // 这里是名字栏的具体信息
      name: '',
      // 是否展示选择生日的对话框
      showBirthSheet: false,
      // 最小可选择的日期(0表示一月份)
      minDate: new Date(1990, 0, 1),
      // 最大可以选择的日期
      maxDate: new Date(2023, 11, 31),
      // 现在的日期
      currentDate: new Date()
    }
  },
  computed: {
    // 将vuex容器指定名称的state数据映射到组件中使用
    ...mapState(['userProfile'])
  },
  methods: {
    // 从vuex中将Actions里的指定方法映射到组件中使用
    ...mapActions(['initUserProfile']),

    // 点击名字栏后的监听事件
    onNameCellClick() {
      // 开启名字输入编辑的弹窗
      this.showNameDialog = true
      // 将原先初始的名字写入输入框中
      this.name = this.userProfile.name
      // 修改名称的输入框自动获取焦点
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },

    // 点击生日栏后的监听事件
    onBirthCellClick() {
      // 如果用户的生日初始值存在则为初始值,否则定位到当前日期
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()

      // 将showBirthSheet的值改为true表示显示生日选择框
      this.showBirthSheet = true
    },

    // 上传图片文件的监听
    async onFileChange(e) {
      // e.currentTarget表示当前选中的文件
      const files = e.currentTarget.files
      // 没有选择文件则不执行后续的操作
      if (files.length === 0) return undefined

      // 创建FormDate对象
      const fd = new FormData()
      // 向fd中追加数据项
      fd.append('photo', files[0])

      // 调用API接口请求更新头像
      const { data: res } = await updateUserAvatarAPI(fd)
      if (res.message === 'OK') {
        // 更新用户简介
        this.initUserProfile()
        // 提示用户更新头像成功
        this.$notify({ type: 'success', message: '更新头像成功', duration: 2000 })
      }
      // 打印用户选择的第一个文件
      console.log(files[0])
    },

    // 更新修改名字的请求
    async updateName(done) {
      // 如果请求接口失败，且报错的消息是409 (CONFLICT)，则证明当前提交的名称被占用了，需要进行 try...catch 的处理
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name })
        if (res.message === 'OK') {
          // 关闭对话框
          done()
          // 重新请求用户简介信息
          this.initUserProfile()
          // 提示用户修改名称成功
          this.$notify({ type: 'success', message: '修改名称成功', duration: 2000 })
        }
      } catch (e) {
        if (e.response.status === 409) {
          // 提示用户名称被占用
          this.$notify({ type: 'warning', message: '名称被占用，请更换后重试！', duration: 2000 })
          // 阻止关闭对话框
          done(false)
          // 让输入框持续获得焦点
          this.$refs.nameRef.focus()
        } else {
          // 关闭对话框
          done(false)
          // 提示用户名称被占用
          this.$notify({ type: 'danger', message: '名称更新失败！', duration: 2000 })
        }
      }
    },

    // 更新用户生日的请求
    async updateBirthday(value) {
      // 选择后关闭面板
      this.showBirthSheet = false
      // 使用格式化时间的dayjs提供的.format快速格式化时间
      const dateStr = dayjs(value).format('YYYY-MM-DD')
      // value表示用户选择的日期
      // console.log(dateStr)
      const { data: res } = await updateUserProfileAPI({ birthday: dateStr })
      if (res.message === 'OK') {
        // 重新获取用户简介的信息
        this.initUserProfile()
        // 提示用户更新日期成功
        this.$notify({ type: 'success', message: '更新出生日期成功', duration: 2000 })
      }
    },

    // Dialog输入框关闭前触发的事件
    beforeClose(action, done) {
      // 这里的action代表可能值confirm和cancel，确认时confirm,取消时cancel
      console.log(action)

      // 判断如果点击的是取消则直接关闭对话框
      if (action === 'cancel') return done()

      // 判断输入是否合法
      if (this.name === '' || this.name.length > 11) {
        this.$notify({
          type: 'warning',
          message: '名称的长度需要在1-7个字符之间，请重新输入！',
          duration: 2000
        })
        // 使输入框持续获得焦点
        this.$refs.nameRef.focus()
        return done(false)
      }

      // 前面的检验通过之后发起修改名称的请求
      // 如果请求成功，则调用done()关闭对话框
      // 如果请求失败，则调用done(false)组织关闭对话框
      this.updateName(done)
    }
  },
  created() {
    // 初始化用户简介
    this.initUserProfile()
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
