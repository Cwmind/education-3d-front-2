import request from '@/utils/request'

// 字典树查询
export function requestSysdictTree() {
  return request({
    url: '/admin/sysdict/tree',
    method: 'get'
  })
}
// 根据id查询字典数据
export function requestSysdictById(id) {
  return request({
    url: '/admin/sysdict/' + id,
    method: 'get'
  })
}
// 字典项分页查询
export function requestSysdictitem(params) {
  return request({
    url: '/admin/sysdictitem/page',
    method: 'get',
    params
  })
}
// 新增字典
export function requestAddSysdict(data) {
  return request({
    url: '/admin/sysdict/save',
    method: 'post',
    data
  })
}
// 修改字典
export function requestUpdateSysdict(data) {
  return request({
    url: '/admin/sysdict/update',
    method: 'post',
    data
  })
}
// 删除字典
export function requestDeleteSysdict(data) {
  return request({
    url: '/admin/sysdict/delete',
    method: 'delete',
    data
  })
}
// 新增字典项
export function requestAddSysdictitem(data) {
  return request({
    url: '/admin/sysdictitem/add',
    method: 'post',
    data
  })
}
// 修改字典项
export function requestUpdateSysdictitem(data) {
  return request({
    url: '/admin/sysdictitem/update',
    method: 'post',
    data
  })
}
// 删除字典项
export function requestDeleteSysdictitem(data) {
  return request({
    url: '/admin/sysdictitem/delete',
    method: 'delete',
    data
  })
}
