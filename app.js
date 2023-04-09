// 导入express模块、
const express = require('express')
// 创建express的服务器实例
const app = express()

// 安装并配置网络传输压缩的中间件
// 注意要在静态资源托管前配置该中间件
const compression = require('express-compression')
app.use(compression)

// 将dist目录托管为静态资源服务器
app.use(express.static('./dist'))

// 调用app.listen方法。指定端口号并启动web服务器
app.listen(3001, () => {
  console.log('Express running at http://localhost:3001')
})
