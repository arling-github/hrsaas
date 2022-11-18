import {
  getToken,
  setToken,
  removeToken,
  setTimestamp
} from '@/utils/auth'
import {
  login2,
  getUserInfo,
  getUserDetailById
} from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空对象
}
// 修改状态
const mutations = {
  // 设置token
  setToken2(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 放个人数据
  setUserInfo(state, result) {
    state.userInfo = result
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录操作
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login2(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken2', result)
    setTimestamp() // 登录成功 主动设置 设置当前的时间戳 主动失效
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    context.commit('setUserInfo', baseResult) // 将整个的个人信息设置到用户的vuex数据中
    return baseResult // 这里为什么要返回 为后面做权限的时候埋下伏笔
  },
  // 退出登录
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
