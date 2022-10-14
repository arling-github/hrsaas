import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeKey = 'hrsaas-timestamp-key' // 时间戳的key

export function getTimestamp() {
  return Cookies.get(TimeKey)
}

export function setTimestamp() {
  return Cookies.set(TimeKey, Date.now())
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
