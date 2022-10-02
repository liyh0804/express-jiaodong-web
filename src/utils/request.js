import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import JSON_BIG from 'json-bigint'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  baseURL: '/api',
  timeout: 60000, // 请求超时时间
  // 安装 json-bigint 处理long类型精度丢失问题
  // 或者更改服务器代码使用String 类型
  // 一般日期都是格式化传过来的，就算使用时间戳一般也看不出来 时间相差不大 主键id就不一样了,拿到id想去修改这个数据居然查不到
  // 我这是id出问题了才发现的  原来一直使用的varchar 保存的雪花主键 字段使用String
  // 现在使用bigint 字段使用long就出问题了
  transformResponse: data => {
    try {
      return JSON_BIG.parse(data)
    } catch (err) {
      console.log(err)
      return JSON.parse(data)
    }
  }
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    // const { status, statusText } = error.response
    // if (status === 666 && statusText === 'Unknown Status (666)') {
    //   // token 失效
    //   storage.remove(ACCESS_TOKEN)
    //   if (window.location.pathname !== '/login') {
    //     window.location.href = '/login'
    //   }
    // }

    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  config.headers['Access-Control-Allow-Origin'] = '*'
  if (token) {
    config.headers['X-Access-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if (response.data && response.data.code === 600) {
    storage.remove(ACCESS_TOKEN)
    if (window.location.pathname !== '/user/login') {
      window.location.href = '/user/login'
    }
    return {}
  } else if (response.data && response.data.code === 500) {
    notification.error({
      description: response.data.message || '未知错误'
    })
  }
  return response.data
}, errorHandler)

// const installer = {
//   vm: {},
//   install (Vue) {
//     Vue.use(VueAxios, request)
//   }
// }

export default request

// export {
//   installer as VueAxios,
//   request as axios
// }
