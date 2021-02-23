import axios from 'axios'
import Router from '../router'
import message from 'ant-design-vue/es/message'
// 添加请求拦截器
axios.interceptors.request.use((req) => {
    //统一设置传header
    if (req.url.indexOf("login") == -1) {
        let token = localStorage.getItem("token") || "";
        req.headers.token = token;
    }
    return req;
}, error => {
    return Promise.reject(error);
})
axios.defaults.timeout = 36000000 //设置超时时间
axios.interceptors.response.use(
    response => {
        // 检测某种状态进行重定向
        if (response.data.code === 401) {
            message.error(response.data.message)
            Router.push({
                name: 'login'
            })
        }else if (response.data.code !== 200) {
            message.error(response.data.message)
        } 
        return response
    },
    error => {
        if (error.response.data.code) {
            if (error.response.data.code === 401) {
                message.error(error.response.data.message)
                Router.push({
                    name: 'login'
                })
            } else {
                message.error(error.response.data.message)
            }
        } else {
            message.error(error.response.statusText)
        }
        return Promise.resolve(error.response)
    }
)
export default axios
