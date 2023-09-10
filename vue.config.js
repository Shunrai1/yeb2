const { defineConfig } = require('@vue/cli-service')


let proxyObj={}
proxyObj['/']={
  //websocket
  ws:false,
  target:'http://localhost:8081',
  //发送请求头host会被设置为target
  changeOrigin:true,
  pathWrite:{
    '^/':'/'
  }
}

proxyObj['/ws']={
  ws:false,
  target:'ws://localhost:8081'
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false, //关闭语法检查
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj
  }
})


