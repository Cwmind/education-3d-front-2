<template>
  <el-drawer
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="drawerTitle"
    size="100%"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      ref="questionBankRef"
      :model="questionBankForm"
      :rules="questionBankRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="种类" prop="courseType">
            <el-select
              v-model="questionBankForm.courseType"
              placeholder="请选择种类"
              clearable
              @change="handleCourseTypeChange"
            >
              <el-option
                v-for="item in courseTypesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="类型" prop="courseId">
            <el-select
              v-model="questionBankForm.courseId"
              placeholder="请选择类型"
              clearable
              @change="handleCourseIdChange"
            >
              <el-option
                v-for="item in coursesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="试题类型" prop="questionType">
            <el-select
              v-model="questionBankForm.questionType"
              placeholder="请选择类型"
              clearable
              @change="handleQuestionTypeChange"
            >
              <el-option
                v-for="item in questionTypeOption"
                :key="item.itemKey"
                :label="item.itemName"
                :value="item.itemKey"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="所属工艺/章节" prop="labelList">
            <el-select v-model="questionBankForm.labelList" multiple placeholder="请选择所属工艺/章节" clearable>
              <el-option
                v-for="item in questionLabelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="题干内容" prop="topic">
            <el-input
              v-model="questionBankForm.topic"
              :rows="2"
              type="textarea"
              placeholder="请输入题干内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="option-edit">
            <div class="option-edit-title">选项编辑 <span class="required">*</span></div>
            <el-link
              v-if="questionBankForm.optionList?.length < 6"
              :underline="false"
              type="info"
              icon="Plus"
              @click="handleAddOption"
            >
              新增选项
            </el-link>
          </div>
          <el-row v-for="(option, index) in questionBankForm.optionList" :key="index" :gutter="20">
            <el-col :span="14">
              <el-form-item
                :prop="'optionList.' + index + '.optionValue'"
                :rules="{
                  required: true,
                  message: '请输入选项',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="option.optionValue" placeholder="请输入选项">
                  <template #prepend>{{ option.optionName }}</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-checkbox
                v-model="option.checked"
                label="正确答案"
                @change="handleOptionCheck(index)"
              />
            </el-col>
            <el-col :span="5" class="option-edit-delete">
              <el-link
                v-if="index > 1 && index === questionBankForm.optionList.length - 1"
                :underline="false"
                type="danger"
                icon="Delete"
                @click="handleDeleteOption(index)"
              >
                删除选项
              </el-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="答案解析" prop="answerAnalyze">
            <el-input
              v-model="questionBankForm.answerAnalyze"
              :rows="2"
              type="textarea"
              placeholder="请输入答案解析"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import { getLetter, deepClone } from '@/utils/index'
import getQuestionTypeOption from '@/hooks/questionTypeOption'
import { requestCourseType } from '@/api/basic/common'
import {
  requestQuestionBankAdd,
  requestQuestionBankEdit
} from '@/api/questionBank/questionBankInfo'

const { questionTypeOption } = getQuestionTypeOption()
const emit = defineEmits(['refresh-list'])

const drawerType = ref('add')
const drawerTitle = ref('')
const courseType = ref([])
const courseTypesList = ref([])
const coursesList = ref([])
const questionLabelList = ref([])
const questionBankFormDefault = {
  courseType: '',
  courseId: '',
  questionType: '',
  topic: '',
  optionList: [],
  answerAnalyze: '',
  labelList: []
}
const defaultOptionNum = 4
const questionBankRules = ref({
  courseType: [{ required: true, message: '请选择种类', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择类别', trigger: 'blur' }],
  questionType: [{ required: true, message: '请选择试题类型', trigger: 'blur' }],
  topic: [{ required: true, message: '请输入题干内容', trigger: 'blur' }],
  answerAnalyze: [{ required: true, message: '请输入答案解析', trigger: 'blur' }],
  labelList: [{ required: true, message: '请选择所属工艺/章节', trigger: 'blur' }]
})
const questionBankRef = ref()
const drawerVisible = ref(false)
const questionBankForm = ref(questionBankFormDefault)

// 打开题库抽屉
async function openDrawer(item) {
  const result = await requestCourseType()
  const { code, response } = result
  if (code === 1 && response) {
    courseType.value = response
    courseTypesList.value = response.map((item) => ({
      label: item.courseTypeName,
      value: item.courseType
    }))
  } else {
    courseType.value = []
    courseTypesList.value = []
  }
  if (item) {
    drawerType.value = 'edit'
    drawerTitle.value = '试题信息'
    questionBankForm.value = deepClone(item)
    questionBankForm.value.questionType = item.questionType.toString()
    handleCoursesLabelData(item.courseType)
    handleLabelData(item.courseId)
    initEditOption(item)
  } else {
    drawerType.value = 'add'
    drawerTitle.value = '新增试题'
    questionBankForm.value = questionBankFormDefault
    initAddOption()
  }
  drawerVisible.value = true
}

function initAddOption() {
  for (let i = 0; i < defaultOptionNum; i++) {
    questionBankForm.value.optionList.push({
      optionName: getLetter(i),
      optionValue: '',
      checked: false
    })
  }
}
function initEditOption(item) {
  const { options, correct } = item
  const correctList = correct.split(';')
  questionBankForm.value.optionList = options.map((item) => {
    const parts = item.split(/\.(.+)/, 2)
    const checked = correctList.includes(parts[0])
    return {
      optionName: parts[0],
      optionValue: parts[1],
      checked: checked
    }
  })
}
// 试题类型改变
function handleQuestionTypeChange(val) {
  questionBankForm.value.optionList.forEach((item) => {
    item.checked = false
  })
}
// 添加选项
function handleAddOption() {
  if (questionBankForm.value.optionList.length >= 6) {
    ElMessage({
      message: '最多添加6个选项',
      type: 'warning'
    })
    return
  }
  const optionName = getLetter(questionBankForm.value.optionList.length)
  questionBankForm.value.optionList.push({
    optionName,
    optionValue: '',
    checked: false
  })
}
// 删除选项
function handleDeleteOption(index) {
  if (questionBankForm.value.optionList.length <= 2) {
    ElMessage({
      message: '至少保留两个选项',
      type: 'warning'
    })
    return
  }
  questionBankForm.value.optionList.splice(index, 1)
}
// 选项选中
function handleOptionCheck(index) {
  if (questionBankFormDefault.questionType === '1') {
    questionBankForm.value.optionList.forEach((item) => {
      item.checked = false
    })
    questionBankForm.value.optionList[index].checked = true
  }
}
// 种类改变
function handleCourseTypeChange(val) {
  questionBankForm.value.courseId = ''
  questionBankForm.value.labelList = []
  if (val) {
    handleCoursesLabelData(val)
  } else {
    coursesList.value = []
    questionLabelList.value = []
  }
}
function handleCoursesLabelData(val) {
  coursesList.value = courseType.value
    .find((item) => item.courseType === val)
    .courses.map((item) => ({
      label: item.courseName,
      value: item.courseId,
      labels: item.labels
    }))
  questionLabelList.value = []
}
function handleCourseIdChange(val) {
  questionBankForm.value.label = ''
  if (val) {
    handleLabelData(val)
  } else {
    questionLabelList.value = []
  }
}
function handleLabelData(val) {
  questionLabelList.value = coursesList.value
    .find((item) => item.value === val)
    .labels.map((item) => ({
      label: item,
      value: item
    }))
}

async function addQuestionBank() {
  try {
    const { questionType, optionList } = questionBankForm.value
    const selectCount = optionList.filter((item) => item.checked).length
    console.log('selectCount', selectCount)
    if (selectCount === 0) {
      ElMessage.error('有选项未勾选，选请勾选后再保存')
      return
    }
    if (questionType === '2' && selectCount === 1) {
      ElMessage.error('多选题至少需要两个选项')
      return
    }
    const options = optionList.map((item) => `${item.optionName}.${item.optionValue}`)
    const correct = optionList
      .filter((item) => item.checked)
      .map((item) => item.optionName)
      .sort()
      .join(';')
    const params = {
      courseType: questionBankForm.value.courseType,
      courseId: questionBankForm.value.courseId,
      questionType: questionBankForm.value.questionType,
      topic: questionBankForm.value.topic,
      optionList: options,
      correct,
      answerAnalyze: questionBankForm.value.answerAnalyze,
      labelList: questionBankForm.value.labelList
    }
    const result = await requestQuestionBankAdd(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.log('addQuestionBank error', error)
  }
}
async function editQuestionBank() {
  try {
    const { questionType, optionList } = questionBankForm.value
    const selectCount = optionList.filter((item) => item.checked).length
    if (selectCount === 0) {
      ElMessage.error('有选项未勾选，选请勾选后再保存')
      return
    }
    if (questionType === '2' && selectCount === 1) {
      ElMessage.error('多选题至少需要两个选项')
      return
    }
    const options = optionList.map((item) => `${item.optionName}.${item.optionValue}`)
    const correct = optionList
      .filter((item) => item.checked)
      .map((item) => item.optionName)
      .join(';')
    const params = {
      questionId: questionBankForm.value.questionId,
      courseType: questionBankForm.value.courseType,
      courseId: questionBankForm.value.courseId,
      questionType: questionBankForm.value.questionType,
      topic: questionBankForm.value.topic,
      optionList: options,
      correct,
      answerAnalyze: questionBankForm.value.answerAnalyze,
      labelList: questionBankForm.value.labelList
    }
    const result = await requestQuestionBankEdit(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.log('editQuestionBank error', error)
  }
}

function handleSubmitForm() {
  questionBankRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addQuestionBank()
      } else {
        editQuestionBank()
      }
    }
  })
}

function handleCancel() {
  drawerVisible.value = false
  questionBankRef.value.resetFields()
  questionBankForm.value.optionList = []
}

defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped>
.option-edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #000000;
  font-size: 14px;
  line-height: 22px;
  .required {
    color: #f56c6c;
  }
  :deep(.el-link--info) {
    color: #000000;
    .el-icon {
      margin-right: 4px;
    }
  }
}
.option-edit-delete {
  :deep(.el-link--danger) {
    height: 32px;
    .el-icon {
      margin-right: 4px;
    }
  }
}
:deep(.el-input-group__prepend) {
  background-color: rgba(243, 243, 243, 0.1);
  padding: 0 23px;
}
</style>
