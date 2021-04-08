import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 此Router是自己自定义引入暴露出来的，即是自定义的，以下的Router同样是这样
// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
	return originalPush.call(this, location).catch(err => err)
}
export default new Router({
	mode: 'history',
	routes: [
		{
			/* 首先进行重新定向操作 */
			path: '/',
			redirect: {
				name: 'index'
			}
		},
		{
			path: '/index',
			name: 'index',
			component: () => import('@/views/Index.vue'),
			children: [
				{
					path: '/userManagement',
					name: 'userManagement',
					meta: {
						isLogin: false,
						title: '用户管理--单角色分配'
					},
					component: () => import('@/views/systemManage/UserManagement.vue')
				},
				{
					path: '/userManagementRoles',
					name: 'userManagementRoles',
					meta: {
						isLogin: true,
						title: '用户管理--多角色分配'
					},
					component: () => import('@/views/systemManage/UserManagementRoles.vue')
				},
				{
					path: '/roleManagement',
					name: 'roleManagement',
					meta: {
						isLogin: true,
						title: '角色管理'
					},
					component: () => import('@/views/systemManage/RoleManagement.vue')
				},
				{
					path: '/developmentManagement',
					name: 'developmentManagement',
					meta: {
						isLogin: true,
						title: '部门管理'
					},
					component: () => import('@/views/systemManage/DevelopmentManagement.vue')
				},
				{
					path: '/menuPowerManagement',
					name: 'menuPowerManagement',
					meta: {
						isLogin: true,
						title: '权限管理'
					},
					component: () => import('@/views/systemManage/MenuPowerManagement.vue')
				},
			]
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/Login.vue')
		},
		{
			path: '*',
			name: '404',
			component: () => import ('@/views/404.vue')
		}, 
		{
			path: "*", // 此处需特别注意置于最底部
			redirect: "/404"
		}
	]
})
