import request from '@/utils/request'

// 查询课程中心下拉框数据
export function requestmyCoursePage(data) {
  return request({
    url: '/student/course/page',
    method: 'post',
    data
  })
}
// 我的课程页面，点击开始学习按钮，无数据响应，仅做浏览次数统计
export function requestCourseStartStudy(data) {
  return request({
    url: '/student/course/startStudy',
    method: 'post',
    data: data
  })
}
