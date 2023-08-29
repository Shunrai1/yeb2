import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import App from './App.vue';
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
import store from './store';
import { postRequest,getRequest,putRequest,deleteRequest } from '@/utils/api'
import { initMenu } from './utils/menu';

Vue.config.productionTip = false

Vue.prototype.postRequest=postRequest
Vue.prototype.putRequest=putRequest
Vue.prototype.getRequest=getRequest
Vue.prototype.deleteRequest=deleteRequest

Vue.use(ElementUI,{size:'small'});
Vue.use(VueRouter)

// //解决编程式路由往同一地址跳转时会报错的情况
// const originalPush = VueRouter.prototype.push;
// const originalReplace = VueRouter.prototype.replace;
// //push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch(err => err);
// };
// //replace
// VueRouter.prototype.replace = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalReplace.call(this, location, onResolve, onReject);
//   return originalReplace.call(this, location).catch(err => err);
// }

//全局路由前置器
router.beforeEach((to,from,next)=>{
  if(window.sessionStorage.getItem('tokenStr')){
    initMenu(router,store)

    //判断用户信息是否存在
    if(!window.sessionStorage.getItem('user')){
      return getRequest('admin/info').then(resp=>{
        if(resp){
          window.sessionStorage.setItem('user',JSON.stringify(resp))
          next()
        }
      })
    }
    next()
  }else{
    if(to.path=='/'){
      next()
    }else{
      next('/?redirect='+to.path)
    }
      
  }
  
})

const vm= new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

// console.log(vm)
// console.log('============')
// console.log(vm.$router.options.routes)