import request from '@/utils/request'

export function requestTeacherList(data) {
  return request({
    url: '/admin/teacher/page/list',
    method: 'post',
    data: data
  })
}

export function requestAddTeacher(data) {
  return request({
    url: '/admin/teacher/addTeacher',
    method: 'post',
    data: data
  })
}

export function requestUpdateTeacher(data) {
  return request({
    url: '/admin/teacher/update',
    method: 'post',
    data: data
  })
}

export function requestDeleteTeacher(id) {
  return request({
    url: '/admin/teacher/delete/' + id,
    method: 'post'
  })
}

export function requestImportTeacher(data) {
  return request({
    url: '/admin/teacher/importData',
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: data
  })
}

export function requestExportTeacher(data) {
  return request({
    url: '/admin/teacher/exportData',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}
