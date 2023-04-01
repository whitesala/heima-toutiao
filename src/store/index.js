import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装的处理本地存储的模块
import { myGetItem, mySetItem } from '@/utils/storage'

Vue.use(Vuex)

// 初始化state对象，初始值设置为空
// 注意这里需要使用let来定义不能使用const，因为initState并非不变的，下面可能需要用来接收本地中的token
let initState = {
  tokenInfo: {}
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
    // 将state的值持久化保存在本地
    saveStateToStorage(state) {
      mySetItem('state', state)
    }
  }
})
