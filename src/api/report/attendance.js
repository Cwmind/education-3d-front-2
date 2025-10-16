import request from '@/utils/request'

// 全院工时统计分析
export function requestAttendanceAnalysisData(params) {
  return request({
    url: '/admin/report/getAttendanceAnalysisData',
    method: 'get',
    params
  })
}

// 工时统计分页查询（月维度）
export function requestMonthlyAttendance(params) {
  return request({
    url: '/admin/report/pageMonthlyAttendance',
    method: 'get',
    params
  })
}

// 工时统计分页查询（周维度）
export function requestWeeklyAttendance(params) {
  return request({
    url: '/admin/report/pageWeeklyAttendance',
    method: 'get',
    params
  })
}
// 分页查询考勤信息
export function requestPageAttendance(params) {
  return request({
    url: '/admin/report/pageQryAttendance',
    method: 'get',
    params
  })
}
// 考勤数据导入
export function requestImportAttendance(data) {
  return request({
    url: '/admin/report/importAttendance',
    method: 'post',
    data
  })
}
