import request from '@/utils/request'
// 我的日报-分页查询
export function requestPageDaily(params) {
  return request({
    url: '/student/report/pageDaily',
    method: 'get',
    params
  })
}
// 我的日报-新增
export function requestAddDaily(data) {
  return request({
    url: '/student/report/addDaily',
    method: 'post',
    data
  })
}
// 我的日报-修改
export function requestUpdateDaily(data) {
  return request({
    url: '/student/report/updateDaily',
    method: 'post',
    data
  })
}

// 我的日报-删除
export function requestDeleteDaily(id) {
  return request({
    url: '/student/report/deleteDaily/' + id,
    method: 'delete'
  })
}
