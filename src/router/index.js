// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

const routes =[
	{
		path:'/',
		name: 'Login',
		component:Login,
		hidden:true
	},
	{
		path:'/home',
		name:'导航一',
		component:Home,

	},

]

//创建并暴露一个路由器
export default new VueRouter({
	routes
})