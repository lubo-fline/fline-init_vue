import axios from 'axios';
import Router from '../router';
import message from 'ant-design-vue/es/message';
import util from '@/utils';

// TODO:测试数据
// util.cookies.set('JSESSIONID', '47A1FB9DF80FAF12EEE0415639EF9691');

// 创建一个 axios 实例
const service = axios.create({
    timeout: 36000000, // 设置超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        // const token = util.cookies.get('JSESSIONID');
        // 让每个请求携带 ['JSESSIONID'] 为自定义key 请根据实际情况自行修改
        // config.headers['JSESSIONID'] = token;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 检测某种状态进行重定向
        if (response.data.code === 401) {
            message.error(response.data.msg);
            Router.push({
                name: 'login'
            });
        } else if (response.data.code !== 200) {
            message.error(response.data.msg);
        }
        return response;
    },
    error => {
        if (error.response.data.code) {
            if (error.response.data.code === 401) {
                message.error(error.response.data.msg);
                Router.push({
                    name: 'login'
                });
            } else {
                message.error(error.response.data.msg);
            }
        } else {
            message.error(error.response.statusText);
        }
        return Promise.reject(error.response);
    }
)

export default service;