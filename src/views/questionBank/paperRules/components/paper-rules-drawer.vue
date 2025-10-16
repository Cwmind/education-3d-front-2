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
      ref="paperRulesRef"
      :model="paperRulesForm"
      :rules="paperRulesRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="种类" prop="courseType">
        <el-select
          v-model="paperRulesForm.courseType"
          placeholder="请选择种类"
          :disabled="drawerType === 'edit'"
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
      <el-form-item label="类型" prop="courseId">
        <el-select
          v-model="paperRulesForm.courseId"
          placeholder="请选择类型"
          :disabled="drawerType === 'edit'"
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
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          v-model="paperRulesForm.ruleName"
          placeholder="请输入规则名称"
          :disabled="drawerType === 'edit'"
        />
      </el-form-item>
      <el-form-item label="总分值" prop="totalScore">
        <el-input-number
          v-model="paperRulesForm.totalScore"
          :min="0"
          controls-position="right"
          disabled
          style="width: 100%"
        />
      </el-form-item>
      <div class="option-edit">
        <div class="option-edit-title">规则设置<span class="required">*</span></div>
        <el-link :underline="false" type="info" icon="Plus" @click="handleAddRule">
          新增试题
        </el-link>
      </div>
      <div v-for="(rule, index) in paperRulesForm.rules" :key="index" class="rule-list">
        <el-row :gutter="16">
          <el-col :span="9">
            <el-form-item
              label="试题类型"
              :prop="'rules.' + index + '.questionType'"
              :rules="getQuestionTypeRules(index)"
              required
            >
              <el-select v-model="rule.questionType" placeholder="请选择试题类型">
                <el-option
                  v-for="item in questionTypesList"
                  :key="item.questionType"
                  :label="item.questionTypeName"
                  :value="item.questionType"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="创建者"
              :prop="'rules.' + index + '.createUser'"
              :rules="getCreateUserRules(index)"
              required
            >
              <el-select v-model="rule.createUser" placeholder="请选择创建者">
                <el-option
                  v-for="item in createUsersList"
                  :key="item.createUser"
                  :label="item.userName"
                  :value="item.createUser"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="9">
            <el-form-item label="数量">
              <el-input-number
                v-model="rule.num"
                :min="1"
                :step="1"
                :precision="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="单题分值">
              <el-input-number
                v-model="rule.perScore"
                :min="1"
                :step="1"
                :precision="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-link
              :underline="false"
              type="danger"
              icon="Delete"
              style="margin-top: 36px"
              @click="handleDeleteRule(index)"
            >
              删除选项
            </el-link>
          </el-col>
        </el-row>
      </div>
      <el-form-item label="标签" prop="label">
        <el-select
          v-model="paperRulesForm.label"
          placeholder="请选择标签"
          :disabled="drawerType === 'edit'"
          clearable
        >
          <el-option
            v-for="item in questionLabelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
import { deepClone } from '@/utils/index'
import { requestCourseType } from '@/api/basic/common'
import {
  requestSelectDataQry,
  requestPaperRuleAdd,
  requestPaperRuleEdit
} from '@/api/questionBank/paperRules'

const emit = defineEmits(['refresh-list'])
const drawerType = ref('add')
const drawerTitle = ref('')
const courseType = ref([])
const courseTypesList = ref([])
const coursesList = ref([])
const questionLabelList = ref([])
const questionTypesList = ref([])
const createUsersList = ref([])
const paperRulesFormDefault = {
  courseType: '',
  courseId: '',
  ruleName: '',
  totalScore: 100,
  rules: [],
  label: ''
}
const paperRulesRef = ref()
const paperRulesForm = ref(paperRulesFormDefault)
const paperRulesRules = ref({
  courseType: [{ required: true, message: '请选择种类', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  label: [{ required: true, message: '请选择标签', trigger: 'blur' }]
})
const drawerVisible = ref(false)
// 组卷规则打开页面
async function openDrawer(item) {
  getSelectDataQry()
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
    drawerTitle.value = '组卷规则信息'
    paperRulesForm.value = deepClone(item)
    handleCoursesLabelData(item.courseType)
    handleLabelData(item.courseId)
  } else {
    drawerType.value = 'add'
    drawerTitle.value = '新增组卷规则'
    paperRulesForm.value = paperRulesFormDefault
    initAddOption()
  }
  drawerVisible.value = true
}
function initAddOption() {
  paperRulesForm.value.rules.push({ questionType: '', createUser: '', num: 1, perScore: 1 })
}
async function getSelectDataQry() {
  const result = await requestSelectDataQry()
  const { code, response } = result
  if (code === 1) {
    const { questionTypes, createUsers } = response
    questionTypesList.value = questionTypes.map((item) => ({
      questionType: item.questionType.toString(),
      questionTypeName: item.questionTypeName
    }))
    createUsersList.value = createUsers
  } else {
    questionTypesList.value = []
    createUsersList.value = []
  }
}
// 种类选择
function handleCourseTypeChange(val) {
  paperRulesForm.value.courseId = ''
  paperRulesForm.value.label = ''
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
// 类型选择
function handleCourseIdChange(val) {
  paperRulesForm.value.label = ''
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
// 添加试题规则
function handleAddRule() {
  paperRulesForm.value.rules.push({ questionType: '', createUser: '', num: 1, perScore: 1 })
}
// 删除试题规则
function handleDeleteRule(index) {
  if (paperRulesForm.value.rules.length <= 1) {
    ElMessage({
      message: '至少保留一个试题规则',
      type: 'warning'
    })
    return
  }
  paperRulesForm.value.rules.splice(index, 1)
}
// 试题类型规则
function getQuestionTypeRules(index) {
  return [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择试题类型'))
        } else {
          const { rules } = paperRulesForm.value
          const { createUser } = rules[index]
          if (createUser) {
            const filteredItems = rules.filter(
              (item, idx) => item.createUser === createUser && idx !== index
            )
            const state = filteredItems.some((item) => item.questionType === value)
            if (state) {
              callback(new Error('当前试题类型已存在该创建者'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ]
}
function getCreateUserRules(index) {
  return [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择创建者'))
        } else {
          const { rules } = paperRulesForm.value
          const { questionType } = rules[index]
          if (questionType) {
            const filteredItems = rules.filter(
              (item, idx) => item.questionType === questionType && idx !== index
            )
            const state = filteredItems.some((item) => item.createUser === value)
            if (state) {
              callback(new Error('当前创建者已存在该试题类型'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ]
}
// 添加试卷规则
async function addPaperRules() {
  try {
    const { rules } = paperRulesForm.value
    const totalScore = rules.reduce((sum, item) => sum + item.num * item.perScore, 0)
    if (totalScore !== 100) {
      ElMessage.warning('总分必须为100分')
      return
    }
    rules.forEach((item) => {
      const user = createUsersList.value.find((userItem) => userItem.createUser === item.createUser)
      item.userName = user.userName
    })
    const params = {
      ...paperRulesForm.value,
      rules
    }
    const result = await requestPaperRuleAdd(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.log('addQuestionBank error', error)
  }
}
// 修改试卷规则
async function editPaperRules() {
  try {
    const { rules } = paperRulesForm.value
    const totalScore = rules.reduce((sum, item) => sum + item.num * item.perScore, 0)
    if (totalScore !== 100) {
      ElMessage.warning('总分必须为100分')
      return
    }
    rules.forEach((item) => {
      const user = createUsersList.value.find((userItem) => userItem.createUser === item.createUser)
      item.userName = user.userName
    })
    const params = {
      id: paperRulesForm.value.id,
      courseType: paperRulesForm.value.courseType,
      courseId: paperRulesForm.value.courseId,
      ruleName: paperRulesForm.value.ruleName,
      totalScore: paperRulesForm.value.totalScore,
      rules: rules,
      label: paperRulesForm.value.label
    }
    const result = await requestPaperRuleEdit(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.log('editPaperRules error', error)
  }
}
function handleSubmitForm() {
  paperRulesRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addPaperRules()
      } else {
        editPaperRules()
      }
    }
  })
}
function handleCancel() {
  drawerVisible.value = false
  paperRulesRef.value.resetFields()
  paperRulesForm.value.rules = []
}
defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
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
.rule-list {
  background: #eeeeee;
  padding: 16px;
  margin-bottom: 8px;
}
</style>
