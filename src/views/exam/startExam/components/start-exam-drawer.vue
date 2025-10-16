<template>
  <el-drawer
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="发起考试"
    size="100%"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      ref="startExamRef"
      :model="startExamForm"
      :rules="startExamRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="种类" prop="courseType">
            <el-select
              v-model="startExamForm.courseType"
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
              v-model="startExamForm.courseId"
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
          <el-form-item label="考试班级" prop="classId">
            <el-select v-model="startExamForm.classId" placeholder="请选择考试班级" clearable>
              <el-option
                v-for="item in classList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="总分值" prop="totalScore">
            <el-input-number
              v-model="startExamForm.totalScore"
              :min="0"
              controls-position="right"
              disabled
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="考试工艺/章节" prop="label">
            <el-select
              v-model="startExamForm.label"
              placeholder="请选择考试工艺/章节"
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
        </el-col>
        <el-col :span="10">
          <el-form-item label="试题所属工艺/章节" prop="labelList">
            <el-select
              v-model="startExamForm.labelList"
              placeholder="请选择试题所属工艺/章节"
              multiple
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
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="option-edit">
            <div class="option-edit-title">规则设置<span class="required">*</span></div>
            <el-link :underline="false" type="info" icon="Plus" @click="handleAddRule">
              新增试题
            </el-link>
          </div>
          <div v-for="(rule, index) in startExamForm.rules" :key="index" class="rule-list">
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
        </el-col>
      </el-row>
      <div class="time-limit">
        <div class="time-limit-title">开考时间<span class="required"> *</span></div>
      </div>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="" prop="examTime">
            <el-radio-group v-model="startExamForm.examTime" style="width: 100%">
              <el-radio :value="1">立刻</el-radio>
              <el-radio :value="2">定时</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="startExamForm.examTime === 2" :span="13">
          <el-form-item
            label=""
            prop="examTimeStr"
            :rules="[{ required: true, message: '请选择开考时间', trigger: 'blur' }]"
          >
            <el-date-picker
              v-model="startExamForm.examTimeStr"
              type="datetime"
              placeholder="请选择开考时间"
              prefix-icon="Calendar"
              :clearable="false"
              class="time-limit-picker"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="考试限时" prop="timeLimit">
            <el-input-number
              v-model="startExamForm.timeLimit"
              :min="1"
              :step="1"
              placeholder="请输入考试限时"
              controls-position="right"
              class="time-limit-input"
            >
              <template #suffix>min</template>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="考试说明" prop="examInstruction">
            <el-input
              v-model="startExamForm.examInstruction"
              style="width: 100%"
              :rows="3"
              type="textarea"
              placeholder="请输入考试说明"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">发起考试</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { requestCourseType } from '@/api/basic/common'
import { requestExamAddSelectData, requestExamAddV2 } from '@/api/exam/startExam'
import { requestSelectDataQry } from '@/api/questionBank/paperRules'

const emit = defineEmits(['refresh-list'])
const courseType = ref([])
const courseTypesList = ref([])
const coursesList = ref([])
const questionLabelList = ref([])
const classList = ref([])
const questionTypesList = ref([])
const createUsersList = ref([])

const startExamRef = ref()
const startExamFormDefault = {
  courseType: '',
  courseId: '',
  classId: '',
  totalScore: 100,
  rules: [],
  examTime: '',
  examTimeStr: '',
  timeLimit: null,
  examInstruction: '',
  label: '',
  labelList: []
}
const startExamForm = ref(startExamFormDefault)
const startExamRules = ref({
  courseType: [{ required: true, message: '请选择种类', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择类型', trigger: 'change' }],
  classId: [{ required: true, message: '请选择考试班级', trigger: 'change' }],
  examTime: [{ required: true, message: '请选择开考时间', trigger: 'change' }],
  label: [{ required: true, message: '请选择考试工艺/章节', trigger: 'change' }],
  labelList: [{ required: true, message: '请选择试题所属工艺/章节', trigger: 'change' }]
})
const drawerVisible = ref(false)
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
  startExamForm.value = startExamFormDefault
  initAddOption()
  drawerVisible.value = true
}
function initAddOption() {
  startExamForm.value.rules.push({ questionType: '', createUser: '', num: 1, perScore: 1 })
}
// 获取试题下拉数据
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
// 种类change事件
function handleCourseTypeChange(val) {
  startExamForm.value.courseId = ''
  startExamForm.value.classId = ''
  startExamForm.value.label = ''
  startExamForm.value.labelList = []
  if (val) {
    handleCoursesLabelData(val)
  } else {
    coursesList.value = []
    classList.value = []
    questionLabelList.value = []
  }
}
// 类型下拉数据处理
function handleCoursesLabelData(val) {
  coursesList.value = courseType.value
    .find((item) => item.courseType === val)
    .courses.map((item) => ({
      label: item.courseName,
      value: item.courseId,
      labels: item.labels
    }))
  classList.value = []
  questionLabelList.value = []
}
// 类型change事件
async function handleCourseIdChange(val) {
  startExamForm.value.classId = ''
  startExamForm.value.label = ''
  startExamForm.value.labelList = []
  if (!val) {
    classList.value = []
    questionLabelList.value = []
    return
  } else {
    handleLabelData(val)
  }
  const result = await requestExamAddSelectData({ courseId: val })
  const { code, response } = result
  if (code === 1) {
    const { classInfos } = response
    classList.value = classInfos.map((item) => ({
      label: item.className,
      value: item.classId
    }))
  } else {
    classList.value = []
  }
}
// 试题所属工艺/章节下拉数据
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
  startExamForm.value.rules.push({ questionType: '', createUser: '', num: 1, perScore: 1 })
}
// 删除试题规则
function handleDeleteRule(index) {
  if (startExamForm.value.rules.length <= 1) {
    ElMessage({
      message: '至少保留一个试题规则',
      type: 'warning'
    })
    return
  }
  startExamForm.value.rules.splice(index, 1)
}
// 试题类型规则
function getQuestionTypeRules(index) {
  return [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择试题类型'))
        } else {
          const { rules } = startExamForm.value
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
          const { rules } = startExamForm.value
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
// 提交发起考试数据
async function addStartExam() {
  try {
    const { rules } = startExamForm.value
    const totalScore = rules.reduce((sum, item) => sum + item.num * item.perScore, 0)
    if (totalScore !== 100) {
      ElMessage.warning('总分必须为100分')
      return
    }
    rules.forEach((item) => {
      const user = createUsersList.value.find((userItem) => userItem.createUser === item.createUser)
      item.userName = user.userName
    })
    let examTimeStr = ''
    const { examTime } = startExamForm.value
    if (examTime === 1) {
      examTimeStr = ''
    } else {
      examTimeStr = startExamForm.value.examTimeStr
    }
    const params = {
      courseType: startExamForm.value.courseType,
      courseId: startExamForm.value.courseId,
      examInstruction: startExamForm.value.examInstruction,
      classId: startExamForm.value.classId,
      examTimeStr,
      timeLimit: startExamForm.value.timeLimit,
      label: startExamForm.value.label,
      totalScore: startExamForm.value.totalScore,
      labelList: startExamForm.value.labelList,
      rules
    }
    const result = await requestExamAddV2(params)
    const { code } = result
    if (code === 1) {
      ElMessage.success('保存成功')
      handleCancel()
      emit('refresh-list')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.log('addStartExam error', error)
  }
}
// 表单提交
function handleSubmitForm() {
  startExamRef.value.validate((valid) => {
    if (valid) {
      addStartExam()
    }
  })
}
function handleCancel() {
  drawerVisible.value = false
  startExamRef.value.resetFields()
}
defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped>
:deep(.el-input-group__append) {
  background-color: rgba(243, 243, 243, 0.1);
  color: rgba(0, 0, 0, 0.4);
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
.time-limit {
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
.time-limit-picker {
  :deep(.el-input__wrapper) {
    flex-direction: row-reverse;
  }
}
.time-limit-input {
  width: calc(100% - 57px);
  :deep(.el-input__inner) {
    text-align: left;
  }
  :deep(.el-input__suffix) {
    position: absolute;
    right: -57px;
    width: 57px;
    background: rgba(243, 243, 243, 0.1);
    border-radius: 0px 3px 3px 0px;
    border: 1px solid #dcdcdc;
    display: flex;
    justify-content: center;
  }
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
