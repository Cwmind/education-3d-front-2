<template>
  <el-dialog
    v-model="dialogVisible"
    title="举报评论"
    width="500px"
    :before-close="handleClose"
    append-to-body
    center
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="举报类型" prop="reasonType">
        <el-select v-model="form.reasonType" placeholder="请选择举报类型" style="width: 100%">
          <el-option label="垃圾广告" value="SPAM" />
          <el-option label="虚假信息" value="FALSE_INFO" />
          <el-option label="辱骂攻击" value="ABUSE" />
          <el-option label="其他" value="OTHER" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.reasonType === 'OTHER'"
        label="详细理由"
        prop="reasonDetail"
      >
        <el-input
          v-model="form.reasonDetail"
          type="textarea"
          :rows="3"
          :maxlength="100"
          show-word-limit
          placeholder="请详细说明举报理由"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          提交举报
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { requestReportComment } from '@/api/exam/knowledgeComment'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  commentId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = ref(props.modelValue)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  reasonType: '',
  reasonDetail: ''
})

const rules = {
  reasonType: [
    { required: true, message: '请选择举报类型', trigger: 'change' }
  ],
  reasonDetail: [
    { required: true, message: '请输入详细理由', trigger: 'blur' },
    { min: 5, max: 100, message: '理由长度在 5 到 100 个字符', trigger: 'blur' }
  ]
}

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val) {
    // 重置表单
    form.reasonType = ''
    form.reasonDetail = ''
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

    submitting.value = true

    const data = {
      commentId: props.commentId,
      reasonType: form.reasonType
    }

    if (form.reasonType === 'OTHER') {
      data.reasonDetail = form.reasonDetail
    }

    await requestReportComment(data)

    ElMessage.success('举报成功')
    emit('success')
    handleClose()
  } catch (error) {
    if (error !== false) {
      console.error('举报失败:', error)
      ElMessage.error('举报失败')
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
</style>
