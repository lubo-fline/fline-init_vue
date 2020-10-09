import Vue from 'vue'
import router from './router'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList = ['login'] // 白名单
const defaultRoutePath = '/index'
router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    //判断缓存是否有user_token
    // if (Vue.ls.get('user_token')) {
        /* has token */
        if (to.meta.isLogin == false) {//如果根据菜单配置的数据没有权限
            next({ path: defaultRoutePath, query: { redirect: to.fullPath } })
        } else {
            next()
        }
    // } else {
    //     if (whiteList.includes(to.name)) {
    //         // 在免登录白名单，直接进入
    //         next()
    //     } else {
    //         next({ path: '/login', query: { redirect: to.fullPath } })
    //         next()
    //         NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    //     }
    // }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
