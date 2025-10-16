import request from '@/utils/request'

// 获取我的实训列表
export function requestMyPracticalPage(params) {
  return request({
    url: '/student/practical/page',
    method: 'post',
    data: params
  })
}

// 我的实训，点击开始学习，无数据响应，仅做浏览次数统计
export function requestStartPractical(data) {
  return request({
    url: '/student/practical/startPractical',
    method: 'post',
    data
  })
}

// 考核测试-学生角色
export function requestStartSimulationExam(data) {
  return request({
    url: '/simulation/process/startSimulationExam',
    method: 'post',
    data
  })
}

// 查看考核-学生角色
export function requestQryStuExamInfo(data) {
  return request({
    url: '/simulation/process/qryStuExamInfo',
    method: 'post',
    data
  })
}

// 实训详情-提交评分
export function requestGradeTheCourse(data) {
  return request({
    url: '/simulation/process/gradeTheCourse',
    method: 'post',
    data
  })
}

// 学习进度监控
export function requestStudyProgressMonitor(data) {
  return request({
    url: '/student/practical/studyProgressMonitor',
    method: 'post',
    data
  })
}

// 实训任务进度
export function requestSxrjProgress() {
  return request({
    url: '/student/practical/getSxrjProgress',
    method: 'get'
  })
}
