<template>
  <el-dialog
    v-model="dialogVisible"
    title="分类"
    width="600px"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      ref="classificationRef"
      :model="classificationForm"
      :rules="classificationRules"
      label-width="80px"
    >
      <el-form-item label="种类" prop="courseType">
        <el-select
          v-model="classificationForm.courseType"
          placeholder="请选择种类"
          clearable
          @change="handleTypeChange"
        >
          <el-option
            v-for="item in classificationType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="courseId">
        <el-select v-model="classificationForm.courseId" placeholder="请选择类型" clearable>
          <el-option
            v-for="item in classificationCategory"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deepClone } from '@/utils/index'
import { requestCourseType } from '@/api/basic/common'
import { requestAddCourse, requestUpdateCourse } from '@/api/basicManagement/classManagement'

const emit = defineEmits(['refresh-tree'])

const courseType = ref([])
const classificationType = ref([])
const classificationCategory = ref([])
const dialogType = ref('add')
const dialogVisible = ref(false)
const classificationRef = ref()
const classificationFormDefault = {
  courseType: '',
  courseId: ''
}
const classificationRules = reactive({
  courseType: [{ required: true, message: '请选择种类', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择类型', trigger: 'change' }]
})
const classificationForm = ref(classificationFormDefault)

async function openDialog(item) {
  try {
    const result = await requestCourseType()
    const { code, response } = result
    if (code === 1 && response) {
      courseType.value = response
      classificationType.value = response.map((item) => ({
        label: item.courseTypeName,
        value: item.courseType
      }))
    }
    if (item) {
      dialogType.value = 'edit'
      classificationForm.value = deepClone(item)
      classificationCategory.value = courseType.value
        .find((value) => value.courseType === item.courseType)
        .courses.map((item) => ({
          label: item.courseName,
          value: item.courseId
        }))
    } else {
      dialogType.value = 'add'
      classificationForm.value = classificationFormDefault
    }
  } catch (error) {
    console.log('openDialog error', error)
  }
  dialogVisible.value = true
}
function handleTypeChange(val) {
  classificationForm.value.courseId = ''
  if (val) {
    classificationCategory.value = courseType.value
      .find((item) => item.courseType === val)
      .courses.map((item) => ({
        label: item.courseName,
        value: item.courseId
      }))
  } else {
    classificationCategory.value = []
  }
}

async function addCourse() {
  try {
    const typeItem = classificationType.value.find(
      (item) => item.value === classificationForm.value.courseType
    )
    const categoryItem = classificationCategory.value.find(
      (item) => item.value === classificationForm.value.courseId
    )
    const params = {
      courseType: typeItem.value,
      courseTypeName: typeItem.label,
      courseId: categoryItem.value,
      courseName: categoryItem.label
    }
    const result = await requestAddCourse(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('新增分类成功')
      handleCancel()
      emit('refresh-tree')
    }
  } catch (error) {
    console.log('addCourse error', error)
  }
}
async function editCourse() {
  try {
    const typeItem = classificationType.value.find(
      (item) => item.value === classificationForm.value.courseType
    )
    const categoryItem = classificationCategory.value.find(
      (item) => item.value === classificationForm.value.courseId
    )
    const params = {
      relId: classificationForm.value.relId,
      courseType: typeItem.value,
      courseTypeName: typeItem.label,
      courseId: categoryItem.value,
      courseName: categoryItem.label
    }
    const result = await requestUpdateCourse(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('更新分类成功')
      handleCancel()
      emit('refresh-tree')
    }
  } catch (error) {
    console.log('editCourse error', error)
  }
}

function handleSubmitForm() {
  classificationRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        addCourse()
      } else {
        editCourse()
      }
    }
  })
}

function handleCancel() {
  dialogVisible.value = false
  classificationForm.value = classificationFormDefault
  classificationRef.value.resetFields()
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped></style>
