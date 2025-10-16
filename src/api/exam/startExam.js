import request from '@/utils/request'

export function requestStartExamList(params) {
  return request({
    url: '/admin/exam/queryExamInfo',
    method: 'post',
    data: params
  })
}

export function requestSelectDataQry() {
  return request({
    url: '/admin/exam/querySelectData',
    method: 'post'
  })
}

export function requestExamAddSelectData(params) {
  return request({
    url: '/admin/exam/queryExamAddSelectData',
    method: 'post',
    params: params
  })
}

export function requestExamAdd(params) {
  return request({
    url: '/admin/exam/addExamInfo',
    method: 'post',
    data: params
  })
}

export function requestExamAddV2(params) {
  return request({
    url: '/admin/exam/addExamInfoV2',
    method: 'post',
    data: params
  })
}

export function requestExamDelete(id) {
  return request({
    url: '/admin/exam/deleteExamInfo/' + id,
    method: 'post'
  })
}

export function requestPaperInfo(examId) {
  return request({
    url: '/admin/exam/queryPaper/' + examId,
    method: 'post'
  })
}
