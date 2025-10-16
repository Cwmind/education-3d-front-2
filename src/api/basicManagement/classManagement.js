import request from '@/utils/request'

export function requestCourseTree() {
  return request({
    url: '/admin/class/queryCourseTree',
    method: 'post'
  })
}

export function requestAddCourse(data) {
  return request({
    url: '/admin/class/addCourse',
    method: 'post',
    data: data
  })
}

export function requestUpdateCourse(data) {
  return request({
    url: '/admin/class/updateCourse',
    method: 'post',
    data: data
  })
}

export function requestDeleteCourse(relId) {
  return request({
    url: '/admin/class/deleteCourse/' + relId,
    method: 'post'
  })
}

export function requestClassList(data) {
  return request({
    url: '/admin/class/page/list',
    method: 'post',
    data: data
  })
}

export function requestClassSelect(data) {
  return request({
    url: '/admin/class/classSelect',
    method: 'post',
    params: data
  })
}

export function requestTeacherSelect(data) {
  return request({
    url: '/admin/class/teacherSelect',
    method: 'post',
    params: data
  })
}

export function requestAllTeacherSelect(data) {
  return request({
    url: '/admin/class/getAllTeacherSelect',
    method: 'post',
    params: data
  })
}

export function requestAddClass(data) {
  return request({
    url: '/admin/class/createClass',
    method: 'post',
    data: data
  })
}

export function requestUpdateClass(data) {
  return request({
    url: '/admin/class/updateClass',
    method: 'post',
    data: data
  })
}

export function requestDeleteClass(data) {
  return request({
    url: '/admin/class/deleteClass',
    method: 'post',
    data: data
  })
}

export function requestClassStudentList(data) {
  return request({
    url: '/admin/class/queryClassStudent',
    method: 'post',
    data: data
  })
}

export function requestClassStudentImport(data) {
  return request({
    url: '/admin/class/importClassRelStudent',
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: data
  })
}

export function requestDeleteClassRelStudent(relId) {
  return request({
    url: '/admin/class/deleteClassRelStudent/' + relId,
    method: 'post'
  })
}
