// const webpack = require('webpack')
module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  assetsDir: './',
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = ''
      args[0].chunksSortMode = 'dependency'
      return args
    })
  },
  devServer: {
    proxy: {
      '/api': {
        // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
        // target: 'http://192.168.103.190:6688',
        target: 'http://192.168.103.201:8213',
        // target: 'http://192.168.103.156:9999/',
        // 允许跨域
        changeOrigin: true,
        ws: true
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  }
  // 开启tree-shaking
  // mode: 'production',
  // optimization: {
  //   useExports: true,
  //   // minimizer: [
  //   //   new webpack.TerserPlugin()
  //   // ]
  // }
}
