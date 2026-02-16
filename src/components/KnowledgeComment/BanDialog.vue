<template>
  <el-dialog
    v-model="dialogVisible"
    title="禁言用户"
    width="500px"
    :before-close="handleClose"
    append-to-body
    center
  >
    <el-alert
      :title="`即将禁言用户：${userName}`"
      type="warning"
      :closable="false"
      style="margin-bottom: 20px"
    />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="禁言类型" prop="banType">
        <el-radio-group v-model="form.banType">
          <el-radio :label="1">永久禁言</el-radio>
          <el-radio :label="2">限时禁言</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.banType === 2"
        label="禁言时长"
        prop="banDuration"
      >
        <div class="duration-input">
          <el-input-number
            v-model="durationDays"
            :min="0"
            :max="365"
            placeholder="天"
            style="width: 100px"
          />
          <span class="unit">天</span>
          <el-input-number
            v-model="durationHours"
            :min="0"
            :max="23"
            placeholder="时"
            style="width: 100px"
          />
          <span class="unit">时</span>
          <el-input-number
            v-model="durationMinutes"
            :min="0"
            :max="59"
            placeholder="分"
            style="width: 100px"
          />
          <span class="unit">分</span>
        </div>
      </el-form-item>

      <el-form-item label="禁言原因" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="3"
          :maxlength="200"
          show-word-limit
          placeholder="请输入禁言原因"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="danger" :loading="submitting" @click="handleSubmit">
          确认禁言
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { requestBanUser } from '@/api/exam/knowledgeComment'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = ref(props.modelValue)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  banType: 2,
  banDuration: 0,
  reason: ''
})

const durationDays = ref(0)
const durationHours = ref(0)
const durationMinutes = ref(0)

// 计算总分钟数
const totalMinutes = computed(() => {
  return durationDays.value * 24 * 60 + durationHours.value * 60 + durationMinutes.value
})

const rules = {
  banType: [
    { required: true, message: '请选择禁言类型', trigger: 'change' }
  ],
  banDuration: [
    {
      validator: (rule, value, callback) => {
        if (form.banType === 2 && totalMinutes.value === 0) {
          callback(new Error('请设置禁言时长'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  reason: [
    { required: true, message: '请输入禁言原因', trigger: 'blur' },
    { min: 5, max: 200, message: '原因长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val) {
    // 重置表单，默认限时禁言 7 天
    form.banType = 2
    form.reason = ''
    durationDays.value = 7
    durationHours.value = 0
    durationMinutes.value = 0
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 二次确认
    const confirmText = form.banType === 1
      ? `确定要永久禁言用户 ${props.userName} 吗？`
      : `确定要禁言用户 ${props.userName} ${durationDays.value}天${durationHours.value}小时${durationMinutes.value}分钟吗？`

    await ElMessageBox.confirm(confirmText, '确认禁言', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    submitting.value = true

    const data = {
      userId: props.userId,
      userName: props.userName,
      banType: form.banType,
      reason: form.reason
    }

    if (form.banType === 2) {
      data.days = durationDays.value
      data.hours = durationHours.value
      data.minutes = durationMinutes.value
    }

    await requestBanUser(data)

    ElMessage.success('禁言成功')
    emit('success')
    handleClose()
  } catch (error) {
    if (error !== 'cancel' && error !== false) {
      console.error('禁言失败:', error)
      ElMessage.error(error.response?.data?.message || '禁言失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.duration-input {
  display: flex;
  align-items: center;
  gap: 10px;

  .unit {
    color: #606266;
    font-size: 14px;
  }
}
</style>
