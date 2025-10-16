import request from '@/utils/request'

// 查询课程中心下拉框数据
export function requestSelectDataQry() {
  return request({
    url: '/admin/course/qrySelectData',
    method: 'get'
  })
}

// 分页查询课程信息
export function requestCoursePage(params) {
  return request({
    url: '/admin/course/page',
    method: 'post',
    data: params
  })
}

// 导出课程信息内容
export function requestExportCourse(data) {
  return request({
    url: '/admin/course/exportData',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 课程中心页面，点击教学按钮，无数据响应，仅做浏览次数统计
export function requestCourseTeaching(data) {
  return request({
    url: '/admin/course/teaching',
    method: 'post',
    data: data
  })
}

// 获取课程详情信息
export function requestCourseDetail(params) {
  return request({
    url: '/admin/course/detail/getCourseDetail',
    method: 'get',
    params
  })
}

// 评分下拉框--获取当前课程的章节集合
export function requestChapterSelectList(params) {
  return request({
    url: '/admin/course/detail/getChapterSelectList',
    method: 'get',
    params
  })
}

// 获取评分列表
export function requestCourseScoreList(params) {
  return request({
    url: '/admin/course/detail/getCourseScoreList',
    method: 'get',
    params
  })
}

// 查看考核（老师）--预览试卷
export function requestCoursePreviewPaper(params) {
  return request({
    url: '/admin/course/detail/previewPaper',
    method: 'get',
    params
  })
}

// 校验是否有考试
export function requestCheckExam(params) {
  return request({
    url: '/admin/course/detail/checkExamExist',
    method: 'get',
    params
  })
}
