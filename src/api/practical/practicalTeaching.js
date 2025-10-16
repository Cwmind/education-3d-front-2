import request from '@/utils/request'

// 查询实训教学下拉框数据
export function requestSelectDataQry() {
  return request({
    url: '/admin/practical/qrySelectData',
    method: 'post'
  })
}

// 分页查询实训信息
export function requestPracticalPage(params) {
  return request({
    url: '/admin/practical/page',
    method: 'post',
    data: params
  })
}

// 实训教学页面，点击教学按钮，无数据响应，仅做浏览次数统计
export function requestPracticalTeaching(data) {
  return request({
    url: '/admin/practical/teaching',
    method: 'post',
    data: data
  })
}

// 导出实训教学内容
export function requestExportPractical(data) {
  return request({
    url: '/admin/practical/exportData',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 查询指定工序的仿真内容
export function requestProcessPractical(params) {
  return request({
    url: '/simulation/process/queryByProcessCode',
    method: 'get',
    params
  })
}

// 老师角色查看考核信息
export function requestQryExamInfo(data) {
  return request({
    url: '/simulation/process/qryExamInfo',
    method: 'post',
    data
  })
}

// 老师角色查看考核详情
export function requestQryExamDetail(data) {
  return request({
    url: '/simulation/process/qryExamDetail',
    method: 'post',
    data
  })
}

// 提交评分
export function requestGradeTheCourse(params) {
  return request({
    url: '/simulation/process/gradeTheCourse',
    method: 'post',
    data: params
  })
}
