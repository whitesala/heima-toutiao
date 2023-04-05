<template>
  <div class="home-container">

    <!-- 头部区域 -->
    <van-nav-bar title="首页" fixed>

      <!-- 左侧图标 -->
      <template #left>
        <img src="../../assets/logo.png" alt="logo" class="logo" />
      </template>

      <!-- 右侧搜索 -->
      <!-- 使用编码式导航API：$router.push('/search')跳转到搜索页 -->
      <template #right>
        <van-icon name="search" color="black" size="18" @click="$router.push('/search')"/>
      </template>
    </van-nav-bar>

    <!-- 分类频道列表 -->
    <!-- v-model绑定active，默认是激活第一个 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">

        <!-- 文章频道列表模块 -->
        <keep-alive include="ArtList">
          <ArtList :channelId="item.id"></ArtList>
        </keep-alive>
      </van-tab>

      <!-- 频道管理的小图标 -->
      <van-icon name="plus" size="16" class="plus" @click="showPop = true" />

      <!-- 频道管理的弹出层 -->
      <!-- @closed="isDel = false"表示弹出层关闭时重置删除状态 -->
      <van-popup v-model="showPop" :close-on-click-overlay="false" closeable @closed="isDel = false">
        <div class="popup-container">

          <!-- 弹出层的头部区域 -->
          <van-nav-bar title="频道管理">
            <template #right>
              <van-icon name="cross" size="14" color="white" @click="show = false" />
            </template>
          </van-nav-bar>

          <!-- 弹出层的主体区域 -->
          <div class="pop-body">

            <!-- 我的频道 -->
            <div class="my-channel-box">
              <div class="channel-title">
                <div>
                  <span class="title-bold">已添加频道：</span>
                  <!-- 提示文本 -->
                  <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
                </div>
                <!-- 点击编辑按钮后切换isDel的状态 -->
                <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '完成' : '编辑' }}</span>
              </div>

              <!-- 我的频道列表 -->
              <van-row type="flex">
                <van-col span="6" v-for="(item,index) in userChannel" :key="item.id">
                  <!-- 用户的频道 Item 项 -->
                  <!-- 绑定移除用户频道的方法 -->
                  <div class="channel-item van-hairline--surround" @click="removeUserChannel(item,index)">
                    {{item.name}}

                    <!-- 渲染当isDel为true时删除的图标 -->
                    <!-- 使用v-if根据isDel的boolean值来控制删除图标的显示隐藏 -->
                    <van-badge color="transparent" class="cross-badge" v-if="isDel && item.name !== '推荐' && item.length > 2">
                      <template #content>
                        <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
                      </template>
                    </van-badge>

                  </div>
                </van-col>
              </van-row>
            </div>

            <!-- 分隔线 -->
            <div class="van-hairline--top sp-line"></div>

            <!-- 更多频道 -->
            <div class="more-channel-box">
              <div class="channel-title">
                <div>
                  <span class="title-bold">可添加频道：</span>
                  <span class="title-gray">点击添加频道</span>
                </div>
              </div>
              <!-- 更多频道列表 -->
              <van-row type="flex">
                <van-col span="6" v-for="item in moreChannel" :key="item.id">
                  <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{item.name}}</div>
                </van-col>
              </van-row>
            </div>
          </div>
        </div>

      </van-popup>
    </van-tabs>
  </div>

</template>

<script>
// 导入api接口模块
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI'
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
      userChannel: [],
      // 用于接收所有频道分类列表的数组
      allChannel: [],
      // 是否展示频道管理页面
      showPop: false,
      // 是否处于删除状态
      isDel: false
    }
  },
  components: {
    ArtList
  },
  created() {
    // 初始化用户选择的频道分类
    this.initUserChannel()

    // 初始化所有频道分类
    this.initAllChannel()
    // console.log(this.moreChannel)
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
    // 反初始化用户选择的频道分类的函数
    async initUserChannel() {
    // 调用 API 接口
      const { data: res } = await getUserChannelAPI()
      // 判断请求是否成功
      if (res.message === 'OK') {
      // 为用户的频道列表赋值
        this.userChannel = res.data.channels
      }
    },

    // 初始化所有频道分类的函数
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        this.allChannel = res.data.channels
        // console.log(this.allChannel)
      }
    },

    // 点击将更多频道的分类添加到userChannel中
    addChannel(item) {
      // 将对应点击的分类使用push推入到userChannel数组中
      this.userChannel.push(item)
      // 调用更新用户频道列表的方法
      this.updateUserChannel()
    },

    // 更新用户选择的频道分类列表
    async updateUserChannel(isDelete) {
      const channels = this.userChannel
      // 过滤掉类名为推荐的频道，因为至少需要留有一个推荐的分类（推荐必须保留）
        .filter(item => item.name !== '推荐')
      // 使用数组的map循环，返回一个具有下列属性的新数组
        .map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            seq: index + 1
          }
        })
      // 调用更新用户列表的数组
      const { data: res } = await updateUserChannelAPI(channels)
      if (res.message === '更新用户频道成功') {
        if (isDelete) {
          this.$notify({
            type: 'success',
            message: '移除频道成功',
            duration: 2000,
            background: 'red'
          })
        } else {
          this.$notify({
            type: 'success',
            message: '添加频道成功',
            duration: 2000
          })
        }
      }
    },

    // 移除指定id的频道分类
    removeUserChannel(channel, index) {
      // 处于删除状态
      if (this.isDel) {
        if (channel.name === '推荐' || this.userChannel.length <= 2) return
        // 移除频道
        this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
        // 更新移除频道分类后的用户频道数据到服务器保存
        this.updateUserChannel(true)
      } else {
        // 不处于删除状态
        // 修改Tabs的激活索引项
        this.active = index
        // 关闭popup弹出层
        this.showPop = false
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
  },

  // computed
  computed: {
    // 动态计算所有频道分类中除了用户已选择频道后的其他频道
    moreChannel() {
      // 通过filter滤出还未选择的分类
      return this.allChannel.filter(item => {
        // flag用来记录是否分类已被选择，findIndex未查找到时返回-1
        const flag = this.userChannel.findIndex(x => x.id === item.id)
        // 未找到的是我们需要的，滤出该分类
        if (flag === -1) return true
        return false
      })
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

// 对弹出层进行样式的美化
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}

</style>
