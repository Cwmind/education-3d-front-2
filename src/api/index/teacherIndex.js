import request from '@/utils/request'

// 查询教师首页汇总数据
export function requestQryCounts() {
  return request({
    url: '/teacher/dashboard/qryCounts',
    method: 'post'
  })
}

export function requestLectureAnalysis(params) {
  return request({
    url: '/teacher/dashboard/lectureAnalysis',
    method: 'get',
    params: params
  })
}

export function requestExamAnalysis(params) {
  return request({
    url: '/teacher/dashboard/examAnalysis',
    method: 'get',
    params: params
  })
}
