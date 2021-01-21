import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import Antd from 'ant-design-vue';
/** 缓存 */
import Storage from 'vue-ls';
/** 处理传参 */
import qs from "qs";
import VueI18n from 'vue-i18n'
/* 定义全局日期过滤器 */
import Moment from "moment";
import "moment/locale/zh-cn";
/* 引入md5加密 */
import md5 from "js-md5";
/*引入mock */
import "./mock/index.js";
/*引入路由控制 */
import './permission'
/*api*/
import api from '@/api/index'
/*ie兼容es6*/
import "babel-polyfill";
/* 引入自己的css、less、js */
import "@a/less/components.less";
import "@a/less/common.less";
import "@a/less/style.less";
/* 引入全局组件 */
import './utils/filter' // global filter
/** 可视化界面图表插件 **/
import * as echarts from 'echarts'
/** 引入字体图标方式一：内网，无法访问互联网，需要下载图标代码 **/
import "@a/font/iconfont.js";
//  引入字体图标方式二：外网，可以访问互联网
import { Icon } from 'ant-design-vue';
const IconFont = Icon.createFromIconfontCN({
	scriptUrl: window.staticContentConfig.staticData.IconfontUrl,
});
const options = {
    namespace: '', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'session', // storage name session, local, memory
};
Moment.locale("zh-cn");
axios.defaults.baseURL = "/fline/";
Vue.use(Storage, options);
Vue.use(Antd);
Vue.use(VueI18n);
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs;
Vue.prototype.$md5 = md5;
Vue.prototype.$echarts = echarts
Vue.prototype.$api = api
Vue.component('IconFont', IconFont);
Vue.config.productionTip = false
const i18n = new VueI18n({
    locale: 'zh-CN', // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
})
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
