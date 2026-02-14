import request from '@/utils/request'

// 搜索知识点
export function searchKnowledgeNodes(keyword) {
  return request({
    url: '/admin/knowledge-graph/search',
    method: 'get',
    params: { keyword }
  })
}

// 生成知识子图
export function generateSubgraph(data) {
  return request({
    url: '/admin/intelligent-exam/generate-subgraph',
    method: 'post',
    data
  })
}

// 智能组卷
export function generateExam(data) {
  return request({
    url: '/admin/intelligent-exam/generate-exam',
    method: 'post',
    data
  })
}
