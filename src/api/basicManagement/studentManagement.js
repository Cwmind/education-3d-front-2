import request from '@/utils/request'

export function requestStudentList(data) {
  return request({
    url: '/admin/user/page/list',
    method: 'post',
    data: data
  })
}

export function requestAddStudent(data) {
  return request({
    url: '/admin/user/addStudent',
    method: 'post',
    data: data
  })
}

export function requestUpdateStudent(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data: data
  })
}

export function requestDeleteStudent(id) {
  return request({
    url: '/admin/user/delete/' + id,
    method: 'post'
  })
}

export function requestImportStudent(data) {
  return request({
    url: '/admin/user/importData',
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: data
  })
}

export function requestExportStudent(data) {
  return request({
    url: '/admin/user/exportData',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}
