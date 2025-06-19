import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080', // 根据实际后端地址修改
    timeout: 5000,
    withCredentials: true
})

// 可选：请求拦截器
instance.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

// 拦截器,可删
instance.interceptors.response.use(response => {
    return response
}, error => {
    console.error('接口错误:', error)
    return Promise.reject(error)
})

export default instance
