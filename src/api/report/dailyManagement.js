import request from '@/utils/request'
// 我的日报-分页查询
export function requestPageDaily(params) {
  return request({
    url: '/admin/report/pageDaily',
    method: 'get',
    params
  })
}
