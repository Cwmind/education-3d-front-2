import request from '@/utils/request'

export function requestQuestionBankList(data) {
  return request({
    url: '/admin/question/pageQuery',
    method: 'post',
    data: data
  })
}

export function requestSelectDataQry() {
  return request({
    url: '/admin/question/selectDataQry',
    method: 'post'
  })
}

export function requestQuestionBankAdd(data) {
  return request({
    url: '/admin/question/addQuestion',
    method: 'post',
    data: data
  })
}

export function requestQuestionBankEdit(data) {
  return request({
    url: '/admin/question/updateQuestion',
    method: 'post',
    data: data
  })
}

export function requestQuestionBankDelete(questionId) {
  return request({
    url: '/admin/question/deleteQuestion/' + questionId,
    method: 'post'
  })
}
// 题库信息导入
export function requestImportQuestion(data) {
  return request({
    url: '/admin/question/importQuestion',
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: data
  })
}

export function requestExportQuestionBank(data) {
  return request({
    url: '/admin/question/exportQuestion',
    method: 'post',
    responseType: 'blob',
    data
  })
}
