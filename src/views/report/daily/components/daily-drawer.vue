<template>
  <el-drawer
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="drawerTitle"
    width="520px"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      ref="dailyRef"
      :model="dailyForm"
      :rules="dailyRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="dailyForm.date"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="日报工作内容" prop="content">
        <el-input
          v-model="dailyForm.content"
          :rows="12"
          type="textarea"
          placeholder="请输入日报工作内容"
        />
      </el-form-item>
      <el-form-item label="下一日计划" prop="nextPlan">
        <el-input
          v-model="dailyForm.nextPlan"
          :rows="12"
          type="textarea"
          placeholder="请输入下一日计划"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { pick } from 'lodash'
import { ElMessage } from 'element-plus'
import { requestAddDaily, requestUpdateDaily } from '@/api/report/daily'

const emit = defineEmits(['refresh-list'])
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerType = ref('add')
const dailyFormDefault = {
  date: '',
  content: '',
  nextPlan: ''
}
const dailyForm = ref(dailyFormDefault)
const dailyRules = reactive({
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  content: [{ required: true, message: '请输入日报工作内容', trigger: 'blur' }],
  nextPlan: [{ required: true, message: '请输入下一日计划', trigger: 'blur' }]
})
const dailyRef = ref()
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
async function addDaily() {
  const result = await requestAddDaily(dailyForm.value)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-list')
  } else {
    ElMessage.warning(result.message)
  }
}
async function editDaily() {
  const result = await requestUpdateDaily(dailyForm.value)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-list')
  } else {
    ElMessage.warning(result.message)
  }
}
function handleSubmitForm() {
  dailyRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addDaily()
      } else {
        editDaily()
      }
    }
  })
}
function handleCancel() {
  drawerVisible.value = false
  dailyRef.value.resetFields()
}

function openDrawer(item) {
  if (item) {
    dailyForm.value = pick(item, ['id', 'date', 'content', 'nextPlan'])
    drawerType.value = 'edit'
    drawerTitle.value = '日报信息'
  } else {
    dailyForm.value = dailyFormDefault
    drawerType.value = 'add'
    drawerTitle.value = '新增'
  }
  drawerVisible.value = true
}
defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped></style>
