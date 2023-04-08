import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装的处理本地存储的模块
import { myGetItem, mySetItem } from '@/utils/storage'
// 按需导入请求用户基本信息的API
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI'

Vue.use(Vuex)

// 初始化state对象，初始值设置为空
// 注意这里需要使用let来定义不能使用const，因为initState并非不变的，下面可能需要用来接收本地中的token
let initState = {
  tokenInfo: {},
  userInfo: {},
  userProfile: {}
}
// 尝试获取本地存储中的值
const stateStr = myGetItem('state')
// 判断本地存储中是否有token
if (stateStr) initState = stateStr

export default new Vuex.Store({
  // 为state赋值
  state: initState,

  mutations: {

    // 更新tokenInfo数据的方法
    updateTokenInfo(state, payload) {
      // 将提交过来的payload对象作为tokenInfo的值
      state.tokenInfo = payload

      // 测试state中是否有值
      console.log(state)

      // 通过commit调用saveStateToStorage
      // 这里的this表示当前new出来的store实例化对象
      this.commit('saveStateToStorage')
    },

    // 更新用户信息
    updateUserInfo(state, payload) {
      // 将提交过来的payload载荷赋给userInfo
      state.userInfo = payload
      // 使用commit提交给saveStateToStorage
      this.commit('saveStateToStorage')
    },

    // 更新用户简介信息
    updateUserProfile(state, payload) {
      state.userProfile = payload
      // 使用commit提交给saveStateToStorage
      this.commit('saveStateToStorage')
    },

    clearState(state) {
      // 清空vuex里的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 清空后的state存储到本地，相当于将本地的数据清空
      this.commit('saveStateToStorage')
    },

    // 将state的值持久化保存在本地
    saveStateToStorage(state) {
      mySetItem('state', state)
    }
  },

  // 使用actions处理异步的请求
  actions: {
    async initUserInfo(context) {
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // 将结果提交给mutations节点里的updateUserInfo方法
        context.commit('updateUserInfo', res.data)
      }
    },
    async initUserProfile(context) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        // 将结果提交给mutations节点里的updateUserProfile方法
        context.commit('updateUserProfile', res.data)
      }
    }
  }
})
