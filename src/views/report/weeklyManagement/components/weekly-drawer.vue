<template>
  <el-drawer
    v-model="drawerVisible"
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
      <el-form-item label="部门" prop="dept">
        <el-select v-model="weeklyForm.dept" disabled>
          <el-option v-for="item in deptConfig" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="weeklyForm.realName" disabled />
      </el-form-item>
      <el-form-item label="工号" prop="realName">
        <el-input v-model="weeklyForm.userUuid" disabled />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="weeklyForm.date"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          disabled
          :disabled-date="disabledDate"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="日报工作内容" prop="content">
        <el-input v-model="weeklyForm.content" autosize type="textarea" disabled />
      </el-form-item>
      <el-form-item label="下一日计划" prop="nextPlan">
        <el-input v-model="weeklyForm.nextPlan" autosize type="textarea" disabled />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { deptConfig } from '@/config/deptConfig'

const drawerVisible = ref(false)
const drawerTitle = ref('周报信息')
const weeklyForm = ref({})
function handleCancel() {
  drawerVisible.value = false
  weeklyForm.value = {}
}
function openDrawer(item) {
  weeklyForm.value = {
    dept: item.dept,
    realName: item.realName,
    userUuid: item.userUuid,
    date: item.dateStr,
    content: item.content,
    nextPlan: item.nextPlan
  }
  drawerVisible.value = true
}
defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped></style>
