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
  }
})
