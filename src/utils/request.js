import axios from 'axios'
import { Message } from 'element-ui'
import { getTimestamp } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
const TimeOut = 3000 // 定义一个超时时间
// 创建实例
// 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
// 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
const server = axios.create({
  //   axios的参数配置
  baseURL: process.env.VUE_APP_BASE_API, // 取node的环境变量
  timeout: 5000 // 当吵过多少毫秒时 认定超时
})
// axios的请求拦截器
server.interceptors.request.use(config => {
  // 同学最容易犯的错误 是经常忘记 return config
  // 注入token
  if (store.getters.token) {
    // 检查时间戳是否过期 认为登录时 存入时间戳
    if (IsCheckTimeOut()) {
      //  如果为true 表示超时
      // 登出操作
      store.dispatch('user/logout') // 登出 跳转
      // 跳转到登录页
      router.push('/login') // 调到登录页
      // 如果不想让请求继续发出 终止当前的promise执行
      return Promise.reject(new Error('您的token已经超时'))
    }
    // 判断有无token 有token的情况注入token
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config // 必须return
}, error => {
  // 说明请求之前错了
  return Promise.reject(error)
})
// 接收拦截器
// server.interceptors.response.use(function(response) {
// // axios默认加了一个data
//   const { success, message, data } = response.data
//   //   要根据success的成功与否决定下面的操作
//   if (success) {
//     return data
//   } else {
//     // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
//     Message.error(message) // 提示错误消息
//     return Promise.reject(new Error(message))
//   }
// }, function(error) {
//   Message.error(error.message) // 提示错误信息
//   return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
// })

// axios的响应拦截器
server.interceptors.response.use(response => {
  // 执行成功时
  // axios是默认加了一层data
  const { success, data, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // 执行失败
  //  判断独一无二的状态码
  // error对象里面 有 response参数
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 认为后端接口通过检查告诉我们 token超时了
    // 登出操作
    store.dispatch('user/logout') // 登出 跳转
    router.push('/login') // 调到登录页
  }
  // 在Vue项目中但凡用this的 都是在Vue组件中的
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回一个reject 参数为一个错误对象
})
function IsCheckTimeOut() {
  // 判断是否超时
  // 当前时间-缓存的时间 是否大于3600秒
  var currentTime = Date.now()
  var timeStamp = getTimestamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
// 暴露server
export default server
