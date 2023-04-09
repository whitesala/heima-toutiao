// 导入path核心模块
const path = require('path')
const navPath = path.join(__dirname, './src/nav.less')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
          // 通过外部less文件覆盖默认样式
            hack: `true; @import"${navPath}";`
          }
        }
      }
    }
  },

  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称: window 全局的成员名称
      // 未配置 externals 之前，项目中使用 import 导入的第三方模块，在最终打包时，会被打包合并到一个 js 文件中。最后导致项目体积过大的问题
      // 配置了 external之后，webpack 在进行打包时，会把 externals 节点下声明的第三方包排除在外。因此最终打包生成的 js 文件中，不会包含 externals 节点下的包。这样就优化了打包后项目的体积
      'highlight.js': 'hljs',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      vant: 'vant',
      dayjs: 'dayjs',
      'socket.io-client': 'io',
      popmotion: 'popmotion'
    }
  }
})
