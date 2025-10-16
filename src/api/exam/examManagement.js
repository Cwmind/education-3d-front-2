import request from '@/utils/request'

export function requestSelectDataQry() {
  return request({
    url: '/admin/exam/manage/querySelectData',
    method: 'post'
  })
}

export function requestExamStudentAnalysis(data) {
  return request({
    url: '/admin/exam/manage/examStudentAnalysis',
    method: 'post',
    data
  })
}
export function requestScoreRangeAnalysis(data) {
  return request({
    url: '/admin/exam/manage/scoreRangeAnalysis',
    method: 'post',
    data
  })
}
export function requestExamScoreAnalysis(data) {
  return request({
    url: '/admin/exam/manage/examScoreAnalysis',
    method: 'post',
    data
  })
}

export function requestScoreList(data) {
  return request({
    url: '/admin/exam/manage/queryScoreList',
    method: 'post',
    data
  })
}

export function requestExportScore(data) {
  return request({
    url: '/admin/exam/manage/exportScoreList',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}
