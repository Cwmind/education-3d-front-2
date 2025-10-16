import request from '@/utils/request'

// 获取字典数据
export function getAllDictByType(data) {
  return request({
    url: '/common/getAllDictByType',
    method: 'post',
    params: data
  })
}
// 获取种类
export function requestCourseType() {
  return request({
    url: '/common/getCourseType',
    method: 'post'
  })
}
// 重置密码
export function requestResetPwd(data) {
  return request({
    url: '/common/resetPwd',
    method: 'post',
    params: data
  })
}
// 学习时长查询
export function requestStudyDuration(params) {
  return request({
    url: '/student/course/getStudyDuration',
    method: 'get',
    params
  })
}
// 监控学习时长（学生角色）
export function monitorStudy(data) {
  return request({
    url: '/student/course/monitorStudy',
    method: 'post',
    data
  })
}
