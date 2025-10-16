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
      ref="classRef"
      :model="classForm"
      :rules="classRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="classForm.className"
          placeholder="请输入班级名称"
          :disabled="drawerType === 'edit'"
        />
      </el-form-item>
      <el-form-item label="班级容量" prop="capacity">
        <el-input-number
          v-model="classForm.capacity"
          :min="0"
          :precision="0"
          controls-position="right"
          placeholder="请输入班级容量"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="授课老师" prop="userUuid">
        <el-select v-model="classForm.userUuid" placeholder="请选择授课老师" clearable>
          <el-option
            v-for="item in allTeacherSelectOption"
            :key="item.userUuid"
            :label="item.userName"
            :value="item.userUuid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" prop="validTime">
        <el-date-picker
          v-model="classForm.validTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import getAllTeacherSelectOption from '@/hooks/allTeacherSelectOption'
import { requestAddClass, requestUpdateClass } from '@/api/basicManagement/classManagement'

const { allTeacherSelectOption } = getAllTeacherSelectOption()
const props = defineProps({
  sceneData: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['refresh-list'])

const classFormDefault = {
  className: '',
  capacity: null,
  userUuid: '',
  validTime: []
}
const classRules = reactive({
  className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入班级容量', trigger: 'blur' }],
  userUuid: [{ required: true, message: '请选择授课老师', trigger: 'change' }],
  validTime: [{ required: true, message: '请选择有效期', trigger: 'blur' }]
})

const drawerType = ref('add')
const drawerTitle = ref('')
const classRef = ref()
const drawerVisible = ref(false)
const classForm = ref(classFormDefault)

function openDrawer(item) {
  if (item) {
    classForm.value = {
      classId: item.id,
      className: item.className,
      capacity: item.capacity,
      userUuid: item.userUuid,
      validTime: [item.startDate, item.endDate]
    }
    drawerType.value = 'edit'
    drawerTitle.value = '班级信息'
  } else {
    classForm.value = classFormDefault
    drawerType.value = 'add'
    drawerTitle.value = '新增'
  }
  drawerVisible.value = true
}

async function addClass() {
  try {
    const { relId, courseId } = props.sceneData
    const params = {
      relId,
      courseId,
      className: classForm.value.className,
      capacity: classForm.value.capacity,
      userUuid: classForm.value.userUuid,
      startdateStr: classForm.value.validTime[0],
      enddateStr: classForm.value.validTime[1]
    }
    const result = await requestAddClass(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.log('addClass error', error)
  }
}
async function editClass() {
  try {
    const params = {
      classId: classForm.value.classId,
      capacity: classForm.value.capacity,
      userUuid: classForm.value.userUuid,
      startdateStr: classForm.value.validTime[0],
      enddateStr: classForm.value.validTime[1]
    }
    const result = await requestUpdateClass(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.log('addClass error', error)
  }
}

function handleSubmitForm() {
  classRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addClass()
      } else {
        editClass()
      }
    }
  })
}

function handleCancel() {
  drawerVisible.value = false
  classRef.value.resetFields()
}

defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
