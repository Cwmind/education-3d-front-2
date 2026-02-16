<template>
  <div class="knowledge-comment">
    <!-- 排序和筛选 -->
    <div class="comment-header">
      <div class="header-left">
        <span class="comment-count">共 {{ total }} 条评论</span>
      </div>
      <div class="header-right">
        <el-select v-model="queryParams.sortBy" size="small" style="width: 100px" @change="loadComments">
          <el-option label="最新" value="LATEST" />
          <el-option label="最早" value="EARLIEST" />
          <el-option label="最热" value="HOTTEST" />
        </el-select>
        <el-select v-model="queryParams.roleFilter" size="small" style="width: 100px; margin-left: 10px" @change="loadComments">
          <el-option label="全部" value="ALL" />
          <el-option label="教师" value="TEACHER" />
        </el-select>
        <el-select v-model="queryParams.selectedFilter" size="small" style="width: 100px; margin-left: 10px" @change="loadComments">
          <el-option label="全部" value="ALL" />
          <el-option label="精选" value="SELECTED" />
        </el-select>
      </div>
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input-wrapper">
      <el-input
        v-model="commentContent"
        type="textarea"
        :rows="3"
        :maxlength="500"
        show-word-limit
        placeholder="发表你的看法..."
        :disabled="isBanned"
      />
      <div class="input-actions">
        <span v-if="isBanned" class="ban-notice">您已被禁言，无法发表评论</span>
        <el-button type="primary" size="small" :disabled="!commentContent.trim() || isBanned" @click="handlePublish">
          发表评论
        </el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-loading="loading" class="comment-list">
      <div v-if="comments.length === 0" class="empty-comment">
        <el-empty description="暂无评论" />
      </div>
      <comment-item
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :current-user="currentUser"
        @reply="handleReply"
        @like="handleLike"
        @report="handleReport"
        @delete="handleDelete"
        @select="handleSelect"
        @ban="handleBan"
      />
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="comment-pagination">
      <el-pagination
        v-model:current-page="queryParams.pageIndex"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @current-change="loadComments"
        @size-change="loadComments"
      />
    </div>

    <!-- 举报对话框 -->
    <report-dialog
      v-model="reportDialogVisible"
      :comment-id="currentCommentId"
      @success="handleReportSuccess"
    />

    <!-- 禁言对话框 -->
    <ban-dialog
      v-model="banDialogVisible"
      :user-id="currentUserId"
      :user-name="currentUserName"
      @success="handleBanSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { requestCommentList, requestPublishComment, requestLikeComment } from '@/api/exam/knowledgeComment'
import useUserStore from '@/store/modules/user'
import CommentItem from './CommentItem.vue'
import ReportDialog from './ReportDialog.vue'
import BanDialog from './BanDialog.vue'

const props = defineProps({
  knowledgePointId: {
    type: Number,
    required: true
  }
})

const loading = ref(false)
const comments = ref([])
const total = ref(0)
const commentContent = ref('')
const isBanned = ref(false)

const queryParams = reactive({
  knowledgePointId: props.knowledgePointId,
  sortBy: 'LATEST',
  roleFilter: 'ALL',
  selectedFilter: 'ALL',
  pageIndex: 1,
  pageSize: 20
})

// 当前用户信息
const currentUser = computed(() => {
  const userStore = useUserStore()

  // 直接从 userStore 获取角色和用户信息
  const role = userStore.roles?.[0] || 'student'
  const userId = userStore.userInfo?.userUuid || ''
  const userName = userStore.userInfo?.userName || ''

  console.log('=== 评论组件用户信息 ===')
  console.log('角色:', role)
  console.log('用户ID:', userId)
  console.log('用户名:', userName)
  console.log('=====================')

  return {
    userId: userId,
    userName: userName,
    userRole: role,
    role: role
  }
})

// 举报对话框
const reportDialogVisible = ref(false)
const currentCommentId = ref(null)

// 禁言对话框
const banDialogVisible = ref(false)
const currentUserId = ref('')
const currentUserName = ref('')

// 回复状态
const replyingTo = ref(null)

// 加载评论列表
async function loadComments() {
  loading.value = true
  try {
    const res = await requestCommentList(queryParams)
    if (res.code === 1) {
      comments.value = res.response.list || []
      total.value = res.response.total || 0
    }
  } catch (error) {
    console.error('加载评论失败:', error)
    ElMessage.error('加载评论失败')
  } finally {
    loading.value = false
  }
}

// 发表评论
async function handlePublish() {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  try {
    const data = {
      knowledgePointId: props.knowledgePointId,
      content: commentContent.value.trim()
    }

    // 如果是回复
    if (replyingTo.value) {
      data.parentId = replyingTo.value.id
      data.replyToUserId = replyingTo.value.userId
      data.replyToUserName = replyingTo.value.userName
    }

    await requestPublishComment(data)
    ElMessage.success('发表成功')
    commentContent.value = ''
    replyingTo.value = null
    await loadComments()
  } catch (error) {
    console.error('发表评论失败:', error)
    if (error.response?.data?.message?.includes('禁言')) {
      isBanned.value = true
      ElMessage.error('您已被禁言，无法发表评论')
    } else {
      ElMessage.error('发表评论失败')
    }
  }
}

// 回复评论
function handleReply(comment) {
  replyingTo.value = comment
  commentContent.value = `@${comment.userName} `
}

// 点赞/点踩
async function handleLike(comment, type) {
  try {
    // 判断操作类型
    let requestType = type

    // 如果点击点赞按钮
    if (type === 1) {
      if (comment.isLiked) {
        // 已点赞，取消点赞
        requestType = 0
      }
    }

    // 如果点击点踩按钮
    if (type === 2) {
      if (comment.isDisliked) {
        // 已点踩，取消点踩
        requestType = 0
      }
    }

    await requestLikeComment({
      commentId: comment.id,
      type: requestType
    })

    // 重新加载评论列表
    await loadComments()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 举报评论
function handleReport(comment) {
  currentCommentId.value = comment.id
  reportDialogVisible.value = true
}

// 举报成功
function handleReportSuccess() {
  ElMessage.success('举报成功，我们会尽快处理')
}

// 删除评论
async function handleDelete(comment) {
  // 由 CommentItem 组件处理
}

// 精选评论
async function handleSelect(comment) {
  // 由 CommentItem 组件处理
}

// 禁言用户
function handleBan(userId, userName) {
  currentUserId.value = userId
  currentUserName.value = userName
  banDialogVisible.value = true
}

// 禁言成功
function handleBanSuccess() {
  ElMessage.success('禁言成功')
}

onMounted(() => {
  loadComments()
})
</script>

<style lang="scss" scoped>
.knowledge-comment {
  padding: 20px;
  background: #fff;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}

.header-left {
  .comment-count {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.comment-input-wrapper {
  margin-bottom: 20px;

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    .ban-notice {
      color: #f56c6c;
      font-size: 13px;
    }
  }
}

.comment-list {
  min-height: 200px;
}

.empty-comment {
  padding: 40px 0;
}

.comment-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}
</style>
