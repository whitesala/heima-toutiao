<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <!-- 评论列表 -->
    <van-list class="cmt-list"  v-model="loading" :finished="finished" finished-text="已经到底了" :immediate-check="true" @load="onLoad">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="item in cmtList" :key="item.com_id.toString()">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar">
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <!-- 点赞状态 -->
            <van-icon name="like" size="16" color="red" v-if="item.is_liking" @click="disLikeCmt(item)"/>
            <!-- 未点赞状态 -->
            <van-icon name="like-o" size="16" color="gray" v-else @click="addLikeCmt(item)" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          {{ item.content }}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
      <div class="icon-box">
        <van-badge :content="cmtCount" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList"/>
        </van-badge>
        <van-icon name="star" size="20" v-if="isCollected" @click="unCollectArt"/>
        <van-icon name="star-o" size="20" v-else @click="collectArt"/>
        <van-icon name="share-o" size="20" @click="showShare = true"/>
        <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" v-if="showShare"/>
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" @blur="hiddenBox2" ref="iptCmt" v-model.trim="userCmt"></textarea>
      <!-- 分享的弹出层 -->
      <van-button type="default" :disabled="userCmt
      .length === 0" @click="pubCmt">发布</van-button>
    </div>

  </div>
</template>

<script>
// 按需导入文章评论的API
import { getCmtListAPI, addLikeCmtAPI, disLikeCmtAPI, pubCmtAPI, collectArtAPI, unCollectArtAPI } from '@/api/articleAPI'
// 从第三包popmotion里面按需导入animation动画函数
// 作用是点击评论的图标后能实现平滑滚动到评论区域
import { animate } from 'popmotion'

export default {
  name: 'ArtCmt',
  data() {
    return {
      // 点赞评论，默认为false
      // is_liking: false,
      // 文章评论列表数据
      cmtList: [],
      // 偏移量:主要用于检测该页面数据的最后一条
      offset: null,
      // loading表示是否在加载
      // 这里
      loading: true,
      // finished表示是否已经加载完成所有数据
      finished: false,
      // 选择展示的评论区域
      isShowBox1: true,
      // 获取评论总数
      cmtCount: 0,
      // 用户输入的评论文本
      userCmt: '',
      // 是否收藏文章
      isCollected: false,
      // 分享的相关数据设置
      showShare: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    }
  },
  props: {
    artId: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.initCmtList()
  },
  methods: {

    // 初始化文章评论列表
    async initCmtList() {
      const { data: res } = await getCmtListAPI(this.artId, this.offset)
      if (res.message === 'OK') {
        // 获取评论总数
        this.cmtCount = res.data.total_count

        // 将文章偏移量设置为返回结果的last_id属性
        this.offset = res.data.last_id

        // 下拉加载到的方式将新数据添加到旧数据后面
        // 使用数组的展开语法
        this.cmtList = [...this.cmtList, ...res.data.results]
        // 手动将loading设置为false
        this.loading = false

        // 判断res.data.results数组里面的长度是否为0
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },

    // 喜欢评论
    // 这里传递的cmt是文章的评论项
    async addLikeCmt(cmt) {
      const { data: res } = await addLikeCmtAPI(cmt.com_id.toString())
      if (res.message === 'OK') {
        // 设置is_liking为true，表示已喜欢该评论
        cmt.is_liking = true
      }
    },

    // 取消喜欢评论
    async disLikeCmt(cmt) {
      const res = await disLikeCmtAPI(cmt.com_id.toString())
      if (res.status === 204) {
        // 设置is_liking为false，表示已取消喜欢该评论
        cmt.is_liking = false
      }
    },

    // 发布文章的监听事件
    async pubCmt() {
      const { data: res } = await pubCmtAPI(this.artId, this.userCmt)
      if (res.message === 'OK') {
        // 评论总数自动自加1
        this.cmtCount += 1
        // 将评论自动追加到cmtList里面
        // 同时给追加的数据的is_liking属性默认为false
        res.data.new_obj.is_liking = false
        this.cmtList.unshift(res.data.new_obj)
        // 提示用户发表评论成功
        this.$toast.success('发表评论成功!')
      }
    },

    // 加载事件的监听
    onLoad() {
      this.initCmtList()
    },

    // 展开第二个评论区域
    showBox2() {
      // 隐藏评论区域1，显示评论区域2
      this.isShowBox1 = false

      // 将回调函数延迟到下次DOM更新完毕后执行
      this.$nextTick(() => {
        // 使用$refs引用操控输入框元素
        // 使该元素自动获得焦点
        this.$refs.iptCmt.focus()
      })
    },

    // 监听评论输入失去焦点的事件方法
    hiddenBox2() {
      // 失去焦点时，过100ms再隐藏第二个评论区域
      // 目的是使得点击发布评论的按钮能正常响应用户的点击事件
      setTimeout(() => {
        // 隐藏第二个评论区域
        this.isShowBox1 = true
        // 清空用户输入的评论内容
        this.userCmt = ''
      })
    },

    // 滚动到评论列表的区域
    scrollToCmtList() {
      // 当前滚动条位置
      const now = window.scrollY
      // 目标位置（相当于是文章信息区域的高度 ）
      const dist = document.querySelector('.article-container').offsetHeight

      // 实现滚动动画
      animate({
        from: now,
        to: dist,
        onUpdate: latest => window.scrollTo(0, latest)
      })
    },

    // 收藏文章的请求
    async collectArt() {
      const { data: res } = await collectArtAPI(this.artId)
      if (res.message === 'OK') {
        this.isCollected = true
        this.$toast.success('已收藏')
      }
    },

    // 取消收藏文章的请求
    async unCollectArt() {
      const res = await unCollectArtAPI(this.artId)
      if (res.status === 204) {
        this.isCollected = false
        this.$toast.success('取消收藏')
      }
    }

  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

// 底部评论区
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}

</style>
