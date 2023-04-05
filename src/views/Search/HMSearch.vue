<template>
  <div>
    <!-- Header头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon name="arrow-left" color="white" size="18" class="back" @click="$router.back()"/>
      <!-- 搜索组件 -->
      <van-search v-model.trim="keyword" placeholder="请输入关键词" background="#007Bff" shape="round" ref="searchRef" @input="onInput"/>
    </div>

    <!-- 这里使用v-if v-else判断输入的关键词长度来选择性展示搜索建议列表和搜索历史 -->
    <!-- 搜索建议列表 -->
    <!-- 使用v-html渲染出带标签和样式的内容的高亮效果 -->
    <div class="suggest-list" v-if="keyword.length !== 0">
      <div class="suggest-item" v-for="(item, index) in suggestList" :key="index" v-html="item" @click="gotoSearchResult"></div>
    </div>

    <!-- 搜索历史记录 -->
    <!-- keyword长度为0时显示搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <!-- 点击清空图标时清空history数组 -->
          <van-icon name="delete" class="search-icon" @click="history = []"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(tag, i) in history" :key="i" @click="gotoSearchResult">{{tag}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 搜索建议列表数据
import { getSuggestListAPI } from '@/api/searchAPI'

export default {
  name: 'HMSearch',
  data() {
    return {
      // 搜索关键词
      keyword: '',
      // 延时器
      timer: null,
      // 搜索建议列表数据
      suggestList: [],
      // 搜索历史
      // 如果在本地中找到持久化存储的历史记录则优先渲染，否则为空，记得需要将json字符串进行转换
      history: JSON.parse(localStorage.getItem('kwHistory') || '[]')
    }
  },

  // 搜索框自动获得焦点
  mounted() {
    // 使用DOM获取搜索框
    const ipt = document.querySelector('input[type=search]')
    console.log(ipt)
    // 搜索框自动获得焦点
    // 这里使用逻辑与操作符&&,如果ipt为真则执行后面的ipt.focus()
    // 对比||，如果改为ipt || ipt.focus()，那么就是当ipt不存在时执行后面的ipt.focus()，这里不符合当前的情况
    ipt && ipt.focus()
  },

  methods: {
    // 搜索组件的输入事件
    onInput() {
      // 清除上一次的延时器
      clearTimeout(this.timer)

      // 检测到输入内容为空时，将建议搜素列表数组清空后return出去，不开启延时器
      if (this.keyword.length === 0) {
        this.suggestList = []
        return
      }

      // 输入防抖设置
      // 开启延时器，将延时器储存到timerId里面
      // 每隔多少毫秒才会记录键盘的输入值
      // 这里如果键盘一直输入，那么延时器就会一直开启，直到键盘输入停下的时候才开始倒计时输出keyword结果
      this.timer = setTimeout(() => {
        // 调用获取建议列表的方法
        this.initSuggestList()
      }, 500)
    },

    // 跳转到结果页
    gotoSearchResult(e) {
      // e.currentTarget 是当正在触发事件的那个元素

      // 获取用户当前选中搜索建议项
      const kw = e.currentTarget.innerText
      console.log(kw)
      // 跳转到搜索结果页
      this.$router.push('/search/' + kw)
    },

    // 请求搜索建议数据列表数据的方法
    async initSuggestList() {
      const { data: res } = await getSuggestListAPI(this.keyword)
      if (res.message === 'OK') {
        // console.log(res)
        // 将后端返回的数据传入hlKeywords方法高亮关键词
        this.hlKeywords(res.data.options)
        // suggestList储存数据
        this.suggestList = res.data.options

        // 将新的搜索关键词加入搜索历史中
        const newHistory = this.history.filter(item => item !== this.keyword)
        // unshift() 方法将新项添加到数组的开头，并返回新的长度
        // 每一次新添加的历史记录会在最前面
        newHistory.unshift(this.keyword)
        this.history = newHistory
      }
    },

    // 实现关键词的高亮
    // kwArr表示搜索建议列表的数组
    hlKeywords(kwArr) {
      // 根据用户输入的keyword动态新建正则表达式
      // ig表示忽略大小写和进行全局的匹配
      const kwReg = new RegExp(this.keyword, 'ig')

      // 循环遍历数组中的每一项
      kwArr.forEach((item, index) => {
        // 调用字符串的replace方法来进行关键词的高亮处理
        // 这里的val是用户输入的值
        kwArr[index] = item.replace(kwReg, val => {
          return `<span style="color: red; font-weight: bold;">${val}</span>`
        })
      })
    }
  },

  // watch监听history数组的变化
  watch: {
    history(newVal) {
      // 将搜索历史持久化存储到本地
      localStorage.setItem('kwHistory', JSON.stringify(newVal))
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .back {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
// 搜索建议列表样式美化
.suggest-list {
  .suggest-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
// 搜索历史界面样式美化
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}

</style>
