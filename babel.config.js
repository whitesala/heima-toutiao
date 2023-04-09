module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 实现路由组件按需导入
  plugins: ['@babel/plugin-syntax-dynamic-import']
}
