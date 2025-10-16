import Cookies from 'js-cookie'
import settings from "@/settings";

// 微应用使用appName区分 TokenKey
// 单点登录时 使用固定TokenKey 'sso-token'

const TokenKey = window.__MICRO_APP_ENVIRONMENT__ ? settings.appName + '-Token' : 'sso-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
