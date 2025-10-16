import request from '@/utils/request'
// 我的日报-分页查询
export function requestPageWeekly(params) {
  return request({
    url: '/admin/report/pageWeekly',
    method: 'get',
    params
  })
}
