import request from '@/utils/request'

/**
 * 查询错题数量
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function requestErrorCount(examId) {
  return request({
    url: '/student/error-analysis/count',
    method: 'get',
    params: { examId }
  })
}

/**
 * 生成错题分析报告
 * @param {Object} data - 请求参数
 * @param {Array<number>} data.examIds - 考试ID列表
 * @param {number} data.topN - 显示TOP知识点数量（可选）
 * @returns {Promise}
 */
export function requestErrorReport(data) {
  return request({
    url: '/student/error-analysis/report',
    method: 'post',
    data
  })
}

/**
 * 查询知识点学习资源
 * @param {number} knowledgePointId - 知识点ID
 * @returns {Promise}
 */
export function requestKnowledgeResources(knowledgePointId) {
  return request({
    url: `/student/error-analysis/resources/${knowledgePointId}`,
    method: 'get'
  })
}
