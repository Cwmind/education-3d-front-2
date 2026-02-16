<template>
  <div
    class="comment-item"
    :class="{
      'teacher-comment': comment.userRole === 'TEACHER' || comment.userRole === 'teacher',
      'selected-comment': comment.isSelected
    }"
    @contextmenu.prevent="handleContextMenu"
  >
    <div class="comment-main">
      <!-- 用户头像 -->
      <div class="user-avatar">
        <el-avatar :size="40">{{ comment.userName?.charAt(0) || 'U' }}</el-avatar>
      </div>

      <!-- 评论内容 -->
      <div class="comment-content-wrapper">
        <!-- 用户信息 -->
        <div class="user-info">
          <span class="username" @contextmenu.prevent.stop="handleUsernameContextMenu">
            {{ comment.userName }}
          </span>
          <el-tag v-if="comment.userRole === 'TEACHER' || comment.userRole === 'teacher'" type="primary" size="small" class="role-tag">
            教师
          </el-tag>
          <el-tag v-if="comment.isSelected" type="warning" size="small" class="selected-tag">
            ⭐ 精选
          </el-tag>
        </div>

        <!-- 评论文本 -->
        <div class="comment-text">
          <span v-if="comment.replyToUserName" class="reply-to">
            回复 @{{ comment.replyToUserName }}:
          </span>
          {{ comment.content }}
        </div>

        <!-- 操作栏 -->
        <div class="comment-actions">
          <span class="time">{{ formatTime(comment.createTime) }}</span>
          <el-button
            text
            size="small"
            :type="comment.isLiked ? 'primary' : 'default'"
            @click="$emit('like', comment, 1)"
          >
            <el-icon><CaretTop /></el-icon>
            {{ comment.likeCount || 0 }}
          </el-button>
          <el-button
            text
            size="small"
            :type="comment.isDisliked ? 'danger' : 'default'"
            @click="$emit('like', comment, 2)"
          >
            <el-icon><CaretBottom /></el-icon>
            {{ comment.dislikeCount || 0 }}
          </el-button>
          <el-button text size="small" @click="$emit('reply', comment)">
            <el-icon><ChatDotRound /></el-icon>
            回复
          </el-button>
        </div>
      </div>
    </div>

    <!-- 回复列表 -->
    <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
      <comment-item
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :current-user="currentUser"
        @reply="$emit('reply', $event)"
        @like="(comment, type) => $emit('like', comment, type)"
        @report="$emit('report', $event)"
        @delete="$emit('delete', $event)"
        @select="$emit('select', $event)"
        @ban="(userId, userName) => $emit('ban', userId, userName)"
      />
    </div>
  </div>
</template>

<script setup>
import { CaretTop, CaretBottom, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { requestDeleteComment, requestSelectComment } from '@/api/exam/knowledgeComment'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reply', 'like', 'report', 'delete', 'select', 'ban'])

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  // 1分钟内
  if (diff < 60000) {
    return '刚刚'
  }
  // 1小时内
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 24小时内
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 7天内
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }
  // 超过7天，显示具体日期
  return date.toLocaleDateString()
}

// 评论右键菜单
function handleContextMenu(event) {
  const menuItems = []

  // 获取用户角色（使用小写格式：'admin', 'teacher', 'student'）
  const userRole = props.currentUser.role || props.currentUser.userRole || ''
  const isAdmin = userRole === 'admin'

  console.log('评论右键菜单 - 用户角色:', userRole, '是否管理员:', isAdmin) // 调试日志

  // 学生/教师：举报
  if (!isAdmin) {
    menuItems.push({
      label: '举报评论',
      handler: () => emit('report', props.comment)
    })
  }

  // 管理员：删除、精选
  if (isAdmin) {
    menuItems.push(
      {
        label: '删除评论',
        handler: () => handleDelete()
      },
      {
        label: props.comment.isSelected ? '取消精选' : '精选评论',
        handler: () => handleSelect()
      }
    )
  }

  if (menuItems.length > 0) {
    showContextMenu(event.clientX, event.clientY, menuItems)
  }
}

// 用户名右键菜单
function handleUsernameContextMenu(event) {
  // 获取用户角色（使用小写格式：'admin', 'teacher', 'student'）
  const userRole = props.currentUser.role || props.currentUser.userRole || ''
  const isAdmin = userRole === 'admin'

  console.log('用户名右键菜单 - 用户角色:', userRole, '是否管理员:', isAdmin) // 调试日志

  // 管理员：禁言（不能禁言自己）
  if (isAdmin && props.comment.userId !== props.currentUser.userId) {
    const menuItems = [
      {
        label: '禁言用户',
        handler: () => emit('ban', props.comment.userId, props.comment.userName)
      }
    ]
    showContextMenu(event.clientX, event.clientY, menuItems)
  }
}

// 显示右键菜单
function showContextMenu(x, y, items) {
  // 简单实现：使用 ElMessageBox
  const options = items.map(item => item.label)
  ElMessageBox.confirm('请选择操作', '操作菜单', {
    distinguishCancelAndClose: true,
    confirmButtonText: options[0],
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    items[0].handler()
  }).catch(() => {})
}

// 删除评论
async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？删除后将无法恢复。', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await requestDeleteComment(props.comment.id)
    ElMessage.success('删除成功')
    emit('delete', props.comment)
    // 刷新列表
    window.location.reload()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 精选评论
async function handleSelect() {
  try {
    const isSelected = !props.comment.isSelected
    await requestSelectComment(props.comment.id, isSelected)
    ElMessage.success(isSelected ? '已设为精选' : '已取消精选')
    emit('select', props.comment)
    // 刷新列表
    window.location.reload()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &.teacher-comment {
    background: linear-gradient(to right, #f0f7ff 0%, #ffffff 100%);
    border-left: 3px solid #1890ff;
    padding-left: 12px;
    margin-left: -15px;
    padding-right: 15px;
  }

  &.selected-comment {
    background: linear-gradient(to right, #fffbf0 0%, #ffffff 100%);
    border-left: 3px solid #faad14;
    padding-left: 12px;
    margin-left: -15px;
    padding-right: 15px;
  }
}

.comment-main {
  display: flex;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;
}

.comment-content-wrapper {
  flex: 1;
  min-width: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .username {
    font-weight: 500;
    color: #303133;
    cursor: pointer;

    &:hover {
      color: #1890ff;
    }
  }

  .role-tag {
    background: #1890ff;
    border-color: #1890ff;
  }

  .selected-tag {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-color: #faad14;
    color: #000;
  }
}

.comment-text {
  color: #606266;
  line-height: 1.6;
  word-break: break-word;
  margin-bottom: 8px;

  .reply-to {
    color: #1890ff;
    margin-right: 4px;
  }
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 15px;

  .time {
    font-size: 12px;
    color: #909399;
  }

  .el-button {
    padding: 0 8px;
  }
}

.reply-list {
  margin-left: 52px;
  margin-top: 10px;
  padding-left: 15px;
  border-left: 2px solid #e8e8e8;

  .comment-item {
    padding: 10px 0;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
