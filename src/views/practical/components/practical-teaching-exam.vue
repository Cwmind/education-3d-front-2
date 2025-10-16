<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :append-to-body="false"
    :close-on-click-modal="false"
    :width="dialogWidth"
    top="5vh"
    class="practical-teaching-exam"
    align-center
    :before-close="handleClose"
  >
    <template #header="{ close }">
      <div class="dialog__header">
        <div class="dialog__header--left">
          <div class="left-title">{{ dialogTitle }}</div>
          <!-- <div class="left-bar"></div> -->
        </div>
        <div class="dialog__header--right">
          <el-icon color="#FFFFFF" size="20" @click="close"><CloseBold /></el-icon>
        </div>
      </div>
    </template>
    <div v-loading="contentLoading" class="dialog__body">
      <div v-if="dialogType === 'examList'" class="dialog__body--list">
        <div class="exam-list">
          <template v-if="queryDataList.length > 0">
            <div v-for="item in queryDataList" :key="item.id" class="list-item">
              <div class="item-left">
                <div class="item-left--title">{{ item.examName }}</div>
                <div class="item-left--tag">
                  <div class="tag-item">{{ item.ruleName }}</div>
                  <div class="tag-item">{{ item.examInstruction }}</div>
                  <div class="tag-item">{{ item.examTime }}</div>
                  <div class="tag-item">限时{{ item.timeLimit }}</div>
                </div>
              </div>
              <div class="item-right">
                <el-button type="primary" @click="handleExamDetail(item)">试卷模拟</el-button>
              </div>
            </div>
          </template>
          <BasicNoData v-else />
        </div>
        <div class="exam-list-btn">
          <el-button type="primary" icon="Plus" @click="handleAddExam">新增</el-button>
        </div>
      </div>
      <div v-else-if="dialogType === 'examAdd'" class="dialog__body--add">
        <el-form
          ref="startExamRef"
          :model="startExamForm"
          :rules="startExamRules"
          label-position="top"
          require-asterisk-position="right"
        >
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
          <el-form-item label="总分值" prop="totalScore">
            <el-input-number
              v-model="startExamForm.totalScore"
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
          <div class="time-limit">
            <div class="time-limit-title">开考时间<span class="required"> *</span></div>
          </div>
          <el-row>
            <el-col :span="5">
              <el-form-item label="" prop="examTime">
                <el-radio-group v-model="startExamForm.examTime" style="width: 100%">
                  <el-radio :value="1">立刻</el-radio>
                  <el-radio :value="2">定时</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="startExamForm.examTime === 2" :span="19">
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
          <el-form-item label="考试说明" prop="examInstruction">
            <el-input
              v-model="startExamForm.examInstruction"
              :rows="3"
              maxlength="150"
              type="textarea"
              show-word-limit
              placeholder="请输入考试说明"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <div class="exam-add-btn">
          <el-button type="primary" @click="handleSaveExam">发起考试</el-button>
          <el-button class="back-btn" @click="handleBackExamList">返回上一层</el-button>
        </div>
      </div>
      <div v-else-if="dialogType === 'examDetail'" class="dialog__body--detail">
        <BasicPageTopBottom :marginGap="16">
          <template #top>
            <exam-detail-title ref="examDetailTitleRef" />
          </template>
          <template #content>
            <div class="height-100 basic-result">
              <exam-detail-question ref="examDetailQuestionRef" @back-click="handleBackExamList" />
            </div>
          </template>
        </BasicPageTopBottom>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import processCodeInfo from '@/config/processCodeConfig'
import ExamDetailTitle from './exam-detail-title.vue'
import ExamDetailQuestion from './exam-detail-question.vue'
import { requestCourseType } from '@/api/basic/common'
import { requestSelectDataQry } from '@/api/questionBank/paperRules'
import { requestStartExamList, requestExamAddV2, requestPaperInfo } from '@/api/exam/startExam'

const contentLoading = ref(false)
const dialogWidth = ref(800)
const dialogVisible = ref(false)
const dialogTitle = ref('发起考试')
const dialogType = ref('')
const label = ref('')
const practicalInfo = ref({})
const questionLabelList = ref([])
async function openDialog(data, info) {
  const { processCode } = data
  label.value = processCodeInfo.find((item) => item.code === processCode).name
  practicalInfo.value = info
  getStartExamList()
  getCourseType()
  getSelectDataQry()
  dialogWidth.value = 800
  dialogType.value = 'examList'
  dialogVisible.value = true
}
const queryDataList = ref([])
async function getStartExamList() {
  const { courseId, classId, teacherUuid } = practicalInfo.value
  contentLoading.value = true
  const params = {
    qrySource: 'gxfz',
    courseId,
    classId,
    createUser: teacherUuid,
    label: label.value,
    pageIndex: 1,
    pageSize: 10
  }
  const result = await requestStartExamList(params)
  const { code, response } = result
  contentLoading.value = false
  if (code === 1) {
    const { list } = response
    queryDataList.value = list
  } else {
    queryDataList.value = []
  }
}
// 获取试题所属工艺/章节下拉数据
async function getCourseType() {
  try {
    const result = await requestCourseType()
    if (result.code === 1 && result.response) {
      const { courseType, courseId } = practicalInfo.value
      questionLabelList.value = result.response
        .find((item) => item.courseType === courseType)
        .courses.map((item) => ({
          label: item.courseName,
          value: item.courseId,
          labels: item.labels
        }))
        .find((item) => item.value === courseId)
        .labels.map((item) => ({
          label: item,
          value: item
        }))
    } else {
      questionLabelList.value = []
    }
  } catch (error) {
    questionLabelList.value = []
  }
}
const startExamRef = ref(null)
const startExamForm = ref({})
const startExamRules = ref({
  labelList: [{ required: true, message: '请选择试题所属工艺/章节', trigger: 'change' }],
  examTime: [{ required: true, message: '请选择开考时间', trigger: 'change' }]
})
function handleAddExam() {
  dialogType.value = 'examAdd'
  dialogTitle.value = '新增考试'
  startExamForm.value = {
    examTime: '',
    examTimeStr: '',
    timeLimit: null,
    examInstruction: '',
    labelList: [],
    rules: [{ questionType: '', createUser: '', num: 1, perScore: 1 }],
    totalScore: 100
  }
}
const questionTypesList = ref([])
const createUsersList = ref([])
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
// 保存考试
function handleSaveExam() {
  startExamRef.value.validate(async (valid) => {
    if (valid) {
      const { rules } = startExamForm.value
      const totalScore = rules.reduce((sum, item) => sum + item.num * item.perScore, 0)
      if (totalScore !== 100) {
        ElMessage.warning('总分必须为100分')
        return
      }
      rules.forEach((item) => {
        const user = createUsersList.value.find(
          (userItem) => userItem.createUser === item.createUser
        )
        item.userName = user.userName
      })
      let examTimeStr = ''
      const { examTime } = startExamForm.value
      if (examTime === 1) {
        examTimeStr = ''
      } else {
        examTimeStr = startExamForm.value.examTimeStr
      }
      const { courseType, courseId, classId } = practicalInfo.value
      const params = {
        courseType,
        courseId,
        examInstruction: startExamForm.value.examInstruction,
        classId,
        examTimeStr,
        timeLimit: startExamForm.value.timeLimit,
        label: label.value,
        totalScore: startExamForm.value.totalScore,
        labelList: startExamForm.value.labelList,
        rules
      }
      const result = await requestExamAddV2(params)
      const { code } = result
      if (code === 1) {
        ElMessage.success('保存成功')
        handleBackExamList()
        getStartExamList()
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}
const examDetailTitleRef = ref(null)
const examDetailQuestionRef = ref(null)
async function handleExamDetail(item) {
  dialogWidth.value = 960
  dialogType.value = 'examDetail'
  dialogTitle.value = item.examName
  contentLoading.value = true
  const result = await requestPaperInfo(item.id)
  const { code, response } = result
  contentLoading.value = false
  if (code === 1) {
    examDetailTitleRef.value.initExamTitle(false, response)
    examDetailQuestionRef.value.initExamInfo(false, response)
  } else {
    examDetailTitleRef.value.initExamTitle(false, {})
    examDetailQuestionRef.value.initExamInfo(false, {})
  }
}
function handleBackExamList() {
  dialogWidth.value = 800
  dialogType.value = 'examList'
  dialogTitle.value = '发起考试'
}
function handleClose() {
  dialogVisible.value = false
}
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.practical-teaching-exam {
  :deep(.el-loading-mask) {
    background-color: 'rgba(0, 0, 0, 0.7)';
  }
}
.dialog__body--list {
  :deep(.el-empty) {
    height: 100%;
    opacity: 0.9;
  }
  :deep(.el-loading-mask) {
    background-color: #e9e9e9;
  }
}
.dialog__body--add {
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
  :deep(.el-input.is-disabled .el-input__inner) {
    color: rgba(255, 255, 255, 0.7);
    -webkit-text-fill-color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-form-item__label) {
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-select__wrapper) {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 1px rgba(220, 220, 220, 0.2) inset;
  }
  :deep(.el-select__placeholder) {
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-radio__label) {
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-radio__inner) {
    background-color: transparent;
  }
  :deep(.el-radio__inner:after) {
    background-color: #e95520;
  }
  :deep(.el-date-editor--datetime .el-input__wrapper) {
    flex-direction: row-reverse;
    background-color: rgba(255, 255, 255, 0.1);
  }
  :deep(.el-input__inner) {
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-input--default .el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  :deep(.el-input-group__append) {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-textarea__inner) {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.el-textarea .el-input__count) {
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
  }
}
.time-limit-input {
  width: calc(100% - 57px);
  :deep(.el-input-number__decrease) {
    opacity: 0.5;
  }
  :deep(.el-input-number__increase) {
    opacity: 0.5;
  }
  :deep(.el-input__inner) {
    text-align: left;
  }
  :deep(.el-input__suffix) {
    position: absolute;
    right: -57px;
    width: 57px;
    background: rgba(243, 243, 243, 0.1);
    border-radius: 0px 3px 3px 0px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
.practical-teaching-exam {
  background-color: transparent;
  background-image: url('@/assets/images/practical/practical-dialog-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 24px;
  border-radius: 6px;
  .dialog__header {
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &--left {
      .left-title {
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        line-height: 16px;
        margin-bottom: 8px;
      }
      .left-bar {
        width: 120px;
        height: 4px;
        background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
      }
    }
    &--right {
      height: 20px;
      cursor: pointer;
    }
  }
  .dialog__body {
    display: flex;
    &--list {
      width: 100%;
      height: 488px;
      display: flex;
      flex-direction: column;
      .exam-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 6px;
        .list-item {
          width: 100%;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 16px;
          cursor: pointer;
          &:hover {
            background: rgba(0, 0, 0, 0.6);
          }
          .item-left {
            display: flex;
            flex-direction: column;
            .item-left--title {
              font-weight: 400;
              font-size: 16px;
              color: #ffffff;
              margin-bottom: 8px;
            }
            .item-left--tag {
              display: flex;
              .tag-item {
                height: 28px;
                width: fit-content;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin-right: 8px;
                font-weight: 400;
                font-size: 12px;
                color: #ffffff;
                display: flex;
                align-items: center;
                padding: 0 12px;
              }
            }
          }
        }
      }
      .exam-list-btn {
        width: 100%;
        height: 48px;
        margin-top: 24px;
        .el-button--primary {
          width: 100%;
          height: 100%;
        }
      }
    }
    &--add {
      width: 100%;
      height: 488px;
      padding-top: 8px;
      padding-right: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-y: auto;
      .time-limit {
        font-weight: 400;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 6px;
        line-height: 22px;
        .required {
          color: #f56c6c;
        }
      }
      .exam-add-btn {
        display: flex;
        flex-direction: row-reverse;
        .back-btn {
          background-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          margin-right: 16px;
        }
      }
    }
    &--detail {
      width: 100%;
      height: 588px;
      .basic-page__right-content {
        background: transparent;
      }
      .basic-page__left {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .basic-page__right {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
  .option-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 22px;
    .required {
      color: #f56c6c;
    }
    :deep(.el-link--info) {
      color: rgba(255, 255, 255, 0.7);
      .el-icon {
        margin-right: 4px;
      }
    }
  }
  .rule-list {
    border: 1px solid rgba(255, 255, 255, 0.7);
    padding: 16px;
    margin-bottom: 8px;
  }
}
</style>
