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

/**
 * 获取当前用户信息
 * 从 Pinia store 中获取
 */
export function getUserInfo() {
  // 动态导入 store，避免循环依赖
  try {
    const useUserStore = require('@/store/modules/user').default
    const userStore = useUserStore()

    // 获取角色，使用小写格式（'admin', 'teacher', 'student'）
    const role = userStore.roles?.[0] || 'student'

    console.log('getUserInfo - 用户角色:', role, '所有角色:', userStore.roles) // 调试日志

    return {
      id: userStore.userInfo?.userUuid || '',
      name: userStore.userInfo?.userName || '',
      role: role
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      id: '',
      name: '',
      role: 'student'
    }
  }
}
