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
      ref="weeklyRef"
      :model="weeklyForm"
      :rules="weeklyRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="周开始日期" prop="startDate">
        <el-date-picker
          v-model="weeklyForm.startDate"
          type="date"
          placeholder="请选择周开始日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="周报工作内容" prop="content">
        <el-input
          v-model="weeklyForm.content"
          :rows="12"
          type="textarea"
          placeholder="请输入周报工作内容"
        />
      </el-form-item>
      <el-form-item label="下周计划" prop="nextPlan">
        <el-input
          v-model="weeklyForm.nextPlan"
          :rows="12"
          type="textarea"
          placeholder="请输入下周计划"
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
import { ElMessage } from 'element-plus'
import { requestAddWeekly, requestUpdateWeekly } from '@/api/report/weekly'

const emit = defineEmits(['refresh-list'])
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerType = ref('add')
const weeklyFormDefault = {
  startDate: '',
  content: '',
  nextPlan: ''
}
const weeklyForm = ref(weeklyFormDefault)
const weeklyRules = reactive({
  startDate: [{ required: true, message: '请选择周开始日期', trigger: 'change' }],
  content: [{ required: true, message: '请输入周报工作内容', trigger: 'blur' }],
  nextPlan: [{ required: true, message: '请输入下周计划', trigger: 'blur' }]
})
const weeklyRef = ref(null)
const disabledDate = (time) => {
  // 获取当前日期的星期几，0 表示周日，1 表示周一
  const day = time.getDay()
  return day !== 1 || time.getTime() > Date.now()
}
async function addWeekly() {
  const result = await requestAddWeekly(weeklyForm.value)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-list')
  } else {
    ElMessage.warning(result.message)
  }
}
async function editWeekly() {
  const result = await requestUpdateWeekly(weeklyForm.value)
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
  weeklyRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addWeekly()
      } else {
        editWeekly()
      }
    }
  })
}
function handleCancel() {
  drawerVisible.value = false
  weeklyRef.value.resetFields()
}
function openDrawer(item) {
  if (item) {
    weeklyForm.value = {
      id: item.id,
      startDate: item.date,
      content: item.content,
      nextPlan: item.nextPlan
    }
    drawerType.value = 'edit'
    drawerTitle.value = '周报信息'
  } else {
    weeklyForm.value = weeklyFormDefault
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
