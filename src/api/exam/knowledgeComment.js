import request from '@/utils/request'

/**
 * 查询评论列表
 * @param {Object} params - 查询参数
 * @param {number} params.knowledgePointId - 知识点ID
 * @param {string} params.sortBy - 排序方式：EARLIEST/LATEST/HOTTEST
 * @param {string} params.roleFilter - 角色筛选：ALL/TEACHER
 * @param {string} params.selectedFilter - 精选筛选：ALL/SELECTED
 * @param {number} params.pageIndex - 页码
 * @param {number} params.pageSize - 每页数量
 */
export function requestCommentList(params) {
  return request({
    url: '/knowledge-comment/list',
    method: 'get',
    params
  })
}

/**
 * 发表评论
 * @param {Object} data - 评论数据
 * @param {number} data.knowledgePointId - 知识点ID
 * @param {string} data.content - 评论内容
 * @param {number} data.parentId - 父评论ID（回复时传）
 * @param {string} data.replyToUserId - 回复的用户ID
 * @param {string} data.replyToUserName - 回复的用户名
 */
export function requestPublishComment(data) {
  return request({
    url: '/knowledge-comment/publish',
    method: 'post',
    data
  })
}

/**
 * 点赞/点踩评论
 * @param {Object} data - 操作数据
 * @param {number} data.commentId - 评论ID
 * @param {number} data.type - 操作类型：0-取消，1-点赞，2-点踩
 */
export function requestLikeComment(data) {
  return request({
    url: '/knowledge-comment/like',
    method: 'post',
    data
  })
}

/**
 * 举报评论
 * @param {Object} data - 举报数据
 * @param {number} data.commentId - 评论ID
 * @param {string} data.reasonType - 举报类型：SPAM/FALSE_INFO/ABUSE/OTHER
 * @param {string} data.reasonDetail - 详细理由（OTHER类型时必填）
 */
export function requestReportComment(data) {
  return request({
    url: '/knowledge-comment/report',
    method: 'post',
    data
  })
}

/**
 * 删除评论（管理员）
 * @param {number} commentId - 评论ID
 */
export function requestDeleteComment(commentId) {
  return request({
    url: `/knowledge-comment/${commentId}`,
    method: 'delete'
  })
}

/**
 * 精选评论（管理员）
 * @param {number} commentId - 评论ID
 * @param {boolean} isSelected - 是否精选
 */
export function requestSelectComment(commentId, isSelected) {
  return request({
    url: `/knowledge-comment/${commentId}/select`,
    method: 'put',
    params: { isSelected }
  })
}

/**
 * 禁言用户（管理员）
 * @param {Object} data - 禁言数据
 * @param {string} data.userId - 用户ID
 * @param {number} data.banType - 禁言类型：1-永久，2-限时
 * @param {number} data.banDuration - 禁言时长（分钟，限时禁言时必填）
 * @param {string} data.reason - 禁言原因
 */
export function requestBanUser(data) {
  return request({
    url: '/knowledge-comment/ban-user',
    method: 'post',
    data
  })
}
