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
      ref="teacherRef"
      :model="teacherForm"
      :rules="teacherRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="工号" prop="userUuid">
        <el-input
          v-model="teacherForm.userUuid"
          placeholder="请输入工号"
          :disabled="drawerType === 'edit'"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="teacherForm.realName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-select v-model="teacherForm.major" placeholder="请选择专业" clearable>
          <el-option
            v-for="item in props.majorList"
            :key="item.itemKey"
            :label="item.itemName"
            :value="item.itemKey"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="teacherForm.sex" placeholder="请选择性别">
          <el-option
            v-for="item in props.sexList"
            :key="item.itemKey"
            :label="item.itemName"
            :value="item.itemKey"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="teacherForm.phone" placeholder="请输入手机号码" maxlength="11" />
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
import { ref } from 'vue'
import { pick } from 'lodash'
import { ElMessage } from 'element-plus'
import { requestAddTeacher, requestUpdateTeacher } from '@/api/basicManagement/teacherManagement'

const props = defineProps({
  majorList: {
    type: Array,
    default: () => {
      return []
    }
  },
  sexList: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(['refresh-list'])

const teacherFormDefault = {
  userUuid: '',
  realName: '',
  major: '',
  sex: '',
  phone: ''
}
const teacherRules = reactive({
  userUuid: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  major: [{ required: true, message: '请选择专业', trigger: 'change' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

const drawerType = ref('add')
const drawerTitle = ref()
const teacherRef = ref()
const drawerVisible = ref(false)
const teacherForm = ref(teacherFormDefault)

function openDrawer(item) {
  if (item) {
    teacherForm.value = pick(item, ['id', 'userUuid', 'realName', 'major', 'sex', 'phone'])
    drawerType.value = 'edit'
    drawerTitle.value = '老师信息'
  } else {
    teacherForm.value = teacherFormDefault
    drawerType.value = 'add'
    drawerTitle.value = '新增'
  }
  drawerVisible.value = true
}
async function addTeacher() {
  try {
    const result = await requestAddTeacher(teacherForm.value)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.log('addTeacher error', error)
  }
}
async function editTeacher() {
  try {
    const result = await requestUpdateTeacher(teacherForm.value)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.log('editTeacher error', error)
  }
}

function handleSubmitForm() {
  teacherRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addTeacher()
      } else {
        editTeacher()
      }
    }
  })
}

function handleCancel() {
  drawerVisible.value = false
  teacherRef.value.resetFields()
}

defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped></style>
