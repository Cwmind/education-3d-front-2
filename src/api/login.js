import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/common/getUserFromToken',
    method: 'post'
  })
}

export function modifyUser(data) {
  return request({
    url: '/admin/user/modifyUser',
    method: 'post',
    data
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
