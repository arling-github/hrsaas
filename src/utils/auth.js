import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeKey = 'hrsaas-timestamp-key' // 时间戳的key

// 设置时间戳
export function setTimestamp() {
  return Cookies.set(TimeKey, Date.now())
}

// 获取时间戳
export function getTimestamp() {
  return Cookies.get(TimeKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
