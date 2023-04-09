<template>
  <!-- 每个文章根据其id点击后跳转详情页 -->
    <div @click="$router.push('/article/' + artId)">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <!-- v-lazy懒加载:只有当滚动到对应图片位置时才开始加载图片而不是从一开始就加载全部图片 -->
          <img alt="" class="thumb" v-if="article.cover.type === 1" v-lazy="article.cover.images[0]">
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img v-for="(item,index) in article.cover.images" :key="index" v-lazy="item" alt="" class="thumb">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论 &nbsp;&nbsp; {{ article.pubdate | dateFormat }}</span>
          <!-- 关闭按钮 -->
          <!-- 使用.stop阻止点击事件的冒泡，文章后续要做点击的操作 -->
          <van-icon name="ellipsis" @click.stop="show = true" v-if="closeable"/>
        </div>
      </template>
    </van-cell>

    <!-- 反馈面板 -->
    <!-- 这里的@closed="isFirst = true"表示关闭反馈面板时将isFirst的值设为true,表示下次默认打开一级反馈面板 -->
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="isFirst = true" get-container="body">

      <!-- 一级反馈面板 -->
      <div class="content" v-if="isFirst">
        <!-- 遍历actions数组里面的可选项 -->
        <van-cell v-for="(item,index) in actions " :key="index" :title="item.name" class="center-title" clickable @click="onCellClick(item.name)"/>
      </div>

      <!-- 二级反馈面板 -->
      <div v-else>
        <!-- title-class表示左侧标题额外类名 -->
        <van-cell title-class="center-title" title="返回" clickable @click="isFirst = true"/>
        <van-cell v-for="item in reports" :key="item.type" :title="item.label" class="center-title" clickable @click="reportArticle(item.type)"/>
      </div>
      <!-- <van-popup v-model="showPop" :style="{ height: '30%' }" :duration="2000" closeable >举报成功!谢谢你的反馈</van-popup> -->
    </van-action-sheet>
  </div>
</template>

<script>
// 导入举报文章的类型模块
import reports from '@/api/reports.js'
// 按需导入不感兴趣和举报文章的API
import { dislikeArtAPI, reportArtAPI } from '@/api/homeAPI'

export default {
  name: 'ArtItem',
  props: {
    // 接收文章列表的数组,以对象的形式
    article: {
      type: Object,
      required: true
    },
    // 文章的反馈按钮是否展示
    closeable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 将反馈动态面的展示板默认设置为false
      show: false,
      // 定义反馈面板的一些可选项
      actions: [
        { name: '不感兴趣' },
        { name: '拉黑作者' },
        { name: '反馈垃圾内容' }
      ],
      // 默认展示第一级面板
      isFirst: true,
      // 举报文章类型的数组
      // 第二个面板的可选项列表，数组中每一项的格式 { type, label }
      reports
    }
  },

  methods: {
    async onCellClick(name) {
      if (name === '不感兴趣') {
        // 调用API接口,将文章设置不感兴趣
        const { data: res } = await dislikeArtAPI(this.artId)
        if (res.message === 'OK') {
          // TODO:炸楼操作,触发自定义事件,将文章id发给父组件ArtList(子传父的处理方式)
          this.$emit('remove-article', this.artId)
        }
        this.show = false
      } else if (name === '拉黑作者') {
        this.show = false
      } else if (name === '反馈垃圾内容') {
        // 展示二级反馈面板
        this.isFirst = false
      }
    },

    // 举报文章的监听
    async reportArticle() {
      // 调用举报文章的api
      const { data: res } = await reportArtAPI(this.artId, this.reports.type, this.reports.label)
      if (res.message === 'OK') {
        this.$emit('remove-article', this.artId)
        this.show = false
        // 举报成功后提示消息
        this.$notify({ type: 'success', message: '举报文章成功', duration: 2000, background: 'red' })
      }
    }
  },

  computed: {
    // 文章Id的计算属性
    artId() {
      // 文章的对象art_id是较大数的对象,需要调用.toString()方法转换为字符串类型
      return this.article.art_id.toString()
    }
  }
}
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

// 一级反馈标题
.center-title{
  text-align: center;
}

</style>
