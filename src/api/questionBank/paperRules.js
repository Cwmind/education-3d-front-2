import request from '@/utils/request'

export function requestPaperRuleList(data) {
  return request({
    url: '/admin/paper/rule/page',
    method: 'post',
    data
  })
}

export function requestConditionDataQry() {
  return request({
    url: '/admin/paper/rule/conditionDataQry',
    method: 'post'
  })
}

export function requestSelectDataQry() {
  return request({
    url: '/admin/paper/rule/questionSelectDataQry',
    method: 'post'
  })
}

export function requestPaperRuleAdd(data) {
  return request({
    url: '/admin/paper/rule/addRule',
    method: 'post',
    data
  })
}

export function requestPaperRuleEdit(data) {
  return request({
    url: '/admin/paper/rule/updateRule',
    method: 'post',
    data
  })
}

export function requestPaperRuleDelete(id) {
  return request({
    url: '/admin/paper/rule/deleteRule/' + id,
    method: 'post'
  })
}
