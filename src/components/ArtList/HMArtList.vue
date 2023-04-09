  <template>
    <div>
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" loosing-text="放开我让你见识见识新东西~" success-text="更多的热点get到了!嘿嘿" success-duration="2000" :disabled="finished">
        <!-- 上拉加载 -->
        <!-- :immediate-check="false"表示禁止一进入页面就触发onLoad -->
        <!-- :offset="5"表示当滚动条距离底部小于多少时触发上拉加载的onLoad事件 -->
        <van-list v-model="loading" :finished="finished" loading-text="今天也有很努力的加载喔~" error-text="呜呜呜~好像出错了QAQ" finished-text="到底啦~已经没有更多了-__-||" @load="onLoad" :immediate-check="false" :offset="5">
          <!-- 将整个文章的数组传到ArtItem的组件里面 -->
          <ArtItem v-for="item in artList" :key="item.id" :article="item" @remove-article="removeArticle
          "></ArtItem>
        </van-list>
      </van-pull-refresh>

  </div>
</template>

<script>
// 请求不同频道文章列表的接口
import { getArtListAPI } from '@/api/homeAPI'
// 导入文章各个模块的组件
import ArtItem from '@/components/ArtItem/HMArtItem.vue'
// 导入lodash模块
import _ from 'lodash'
// 定义一个fn储存页面移动的距离,初始为空
const fn = null

export default {
  name: 'ArtList',
  data() {
    return {
      artList: [],
      // 当前时间戳
      timestamp: Date.now(),
      // 上拉加载
      // key 冲突问题
      // 一进入 ArtList.vue 组件中，会立即触发 created 生命周期函数，请求文章列表的数据。
      // 由于 data 中的 loading 值的默认值为 false，因此一进入页面，会立即触发一次 <van-list> 组件的 load 事件
      // 解决方案：把组件内的 loading 默认值，从 false 重置为 true 即可。
      // 这样，只通过 created 发起了首页的数据请求，并没有再次使用 <van-list> 额外请求数据。
      loading: true, // 表示是否正在进行上拉加载的请求,每当触发List组件的上拉加载更多时,List组件会自动将loading设置为true,下一页的数据请求回来后需要手动将其改为false不然下次再出发上拉加载会失效!
      finished: false, // 表示所有数据是否加载完成,false表示还有下一页数据,true表示所有数据加载完毕
      refreshing: false // 是否处于下拉刷新的状态
    }
  },

  components: {
    ArtItem
  },

  props: {
    channelId: {
      type: Number,
      required: true
    }
  },
  created() {
    this.initArtList()
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
    // isRefresh用来判断是出于上拉加载还是下拉刷新的状态
    async initArtList(isRefresh) {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      // console.log(res)
      if (res.message === 'OK') {
        // 接收文章列表和时间戳
        this.timestamp = res.data.pre_timestamp
        // 通过判断isRefresh的boolean值来确认当前的加载状态
        // isRefresh为true时是下拉刷新状态
        if (isRefresh) {
          // 新数据放在旧数据前面
          this.artList = [...res.data.results, ...this.artList]
          // 将refreshing的值设为false
          this.refreshing = false
        } else {
          // 上拉加载获得的数据以点语法展开的形式添加在数组的末尾
          this.artList = [...this.artList, ...res.data.results]
          // 数据请求回来后将loading手动重置为false
          this.loading = false
        }
        // 判断所有数据是否加载完成
        if (res.data.pre_timestamp === null) this.finished = true
      }
    },

    // 上拉加载的监听函数
    onLoad() {
      // 重新调用初始化文章列表的函数渲染页面
      this.initArtList()
    },

    // 下拉刷新的监听函数
    onRefresh() {
      this.initArtList(true)
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
    },

    // 接收到子组件移除文章的请求
    removeArticle(id) {
      // 使用filter过滤移除数组
      // 炸楼操作
      this.artList = this.artList.filter(item => item.art_id.toString() !== id)
      // 判页面剩余文章数量是否小于10,小于10则主动请求下一页数据
      if (this.artList.length < 10) {
        this.initArtList()
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
