import request from '@/utils/request'

// 查询管理员首页整体指标分析
export function requestSummaryData() {
  return request({
    url: '/admin/dashboard/summaryData',
    method: 'get'
  })
}

export function requestBrowseAnalysis() {
  return request({
    url: '/admin/dashboard/browseAnalysis',
    method: 'get'
  })
}
// 老师人气排行榜
export function requestTeacherPopularRank() {
  return request({
    url: '/admin/dashboard/teacherPopularRank',
    method: 'get'
  })
}
// 实时课堂分析
export function requestRealTimeClassAnalysis() {
  return request({
    url: '/admin/dashboard/realTimeClassAnalysis',
    method: 'get'
  })
}

// 学生成绩排行版
export function requestStudentScoreRank() {
  return request({
    url: '/admin/dashboard/studentScoreRank',
    method: 'get'
  })
}
// 学生成绩分布
export function requestScoreDistribution() {
  return request({
    url: '/admin/dashboard/scoreDistribution',
    method: 'get'
  })
}

export function requestMajorDistribution() {
  return request({
    url: '/admin/dashboard/majorDistribution',
    method: 'get'
  })
}
