import request from '@/utils/request'

// 查询条件--操作菜单
export function requestSelectMenuData() {
  return request({
    url: '/admin/syslog/selectMenuData',
    method: 'get'
  })
}

// 操作日志分页查询
export function requestSyslogList(data) {
  return request({
    url: '/admin/syslog/pageQuery',
    method: 'post',
    data
  })
}

// 操作日志导出
export function requestExportSyslog(data) {
  return request({
    url: '/admin/syslog/exportData',
    method: 'post',
    responseType: 'blob',
    data
  })
}
