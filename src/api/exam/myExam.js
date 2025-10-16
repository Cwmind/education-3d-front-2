import request from '@/utils/request'

export function requestExamPaperList(data) {
  return request({
    url: '/student/exam/paperList',
    method: 'post',
    data: data
  })
}

export function requestSelectDataQry() {
  return request({
    url: '/student/exam/selectData',
    method: 'post'
  })
}

export function requestStartExamDetail(data) {
  return request({
    url: '/student/exam/startExam',
    method: 'post',
    data
  })
}

export function requestSubmitPaper(data) {
  return request({
    url: '/student/exam/submitPaper',
    method: 'post',
    data
  })
}

export function requestSubmitExamDetail(data) {
  return request({
    url: '/student/exam/querySubmitPaper',
    method: 'post',
    data
  })
}
