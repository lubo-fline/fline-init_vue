import axios from 'axios'
import Router from '../router'
import message from 'ant-design-vue/es/message'

axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
axios.defaults.timeout = 36000000 //设置超时时间
axios.interceptors.response.use(
    response => {
        // 检测某种状态进行重定向
        if (response.data.code === 401) {
            message.error(response.data.msg)
            Router.push({
                name: 'login'
            })
        } else if (response.data.code !== 200) {
            message.error(response.data.msg)
        }
        return response
    },
    error => {
        if (error.response.data.code) {
            if (error.response.data.code === 401) {
                message.error(error.response.data.msg)
                Router.push({
                    name: 'login'
                })
            } else {
                message.error(error.response.data.msg)
            }
        } else {
            message.error(error.response.statusText)
        }
        return Promise.resolve(error.response)
    }
)
export default axios
