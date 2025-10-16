import request from '@/utils/request'
// 我的周报-分页查询
export function requestPageWeekly(params) {
  return request({
    url: '/student/report/pageWeekly',
    method: 'get',
    params
  })
}
// 我的周报-新增
export function requestAddWeekly(data) {
  return request({
    url: '/student/report/addWeekly',
    method: 'post',
    data
  })
}
// 我的周报-修改
export function requestUpdateWeekly(data) {
  return request({
    url: '/student/report/updateWeekly',
    method: 'post',
    data
  })
}
// 我的周报-删除
export function requestDeleteWeekly(id) {
  return request({
    url: '/student/report/deleteWeekly/' + id,
    method: 'delete'
  })
}
