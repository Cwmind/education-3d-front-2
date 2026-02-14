<template>
  <el-dialog
    v-model="dialogVisible"
    title="智能组卷"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-steps :active="currentStep" align-center finish-status="success">
      <el-step title="搜索知识点" />
      <el-step title="配置模板" />
      <el-step title="设置试题" />
      <el-step title="查看子图" />
      <el-step title="确认" />
    </el-steps>

    <div class="dialog-content">
      <!-- 步骤1: 搜索知识点 -->
      <div v-if="currentStep === 0" class="step-content">
        <el-form :model="formData" label-width="100px">
          <el-form-item label="知识点搜索">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入知识点关键词"
              clearable
              @input="handleSearchKnowledge"
            >
              <template #suffix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="候选知识点">
            <el-select
              v-model="formData.coreNodeId"
              placeholder="请选择核心知识点"
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in knowledgeList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.id"
              >
                <span>{{ item.chineseName }}</span>
                <span v-if="item.textDescription" style="color: #8492a6; font-size: 13px">
                  - {{ item.textDescription }}
                </span>
              </el-option>
            </el-select>
            <div v-if="knowledgeList.length === 0 && searchKeyword" class="no-data-tip">
              未找到相关知识点
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤2: 配置模板 -->
      <div v-if="currentStep === 1" class="step-content">
        <el-form :model="formData.templateConfig" label-width="120px">
          <el-form-item label="最大跳数">
            <el-input-number
              v-model="formData.templateConfig.maxHops"
              :min="1"
              :max="5"
              placeholder="1-5跳"
            />
            <span class="form-tip">设置知识图谱的最大跳数（1-5）</span>
          </el-form-item>
          <el-form-item label="最小关联度">
            <el-input-number
              v-model="formData.templateConfig.minRelevance"
              :min="0"
              :max="1"
              :step="0.1"
              :precision="1"
              placeholder="0-1"
            />
            <span class="form-tip">设置最小关联度阈值（0-1）</span>
          </el-form-item>
          <el-form-item label="关系权重">
            <div class="relation-weights">
              <div class="weight-item">
                <span>前置关系:</span>
                <el-input-number
                  v-model="formData.templateConfig.relationWeights.prerequisite"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  :precision="1"
                  size="small"
                />
              </div>
              <div class="weight-item">
                <span>相关关系:</span>
                <el-input-number
                  v-model="formData.templateConfig.relationWeights.related"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  :precision="1"
                  size="small"
                />
              </div>
              <div class="weight-item">
                <span>扩展关系:</span>
                <el-input-number
                  v-model="formData.templateConfig.relationWeights.extends"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  :precision="1"
                  size="small"
                />
              </div>
            </div>
          </el-form-item>
          <el-alert
            v-if="templateConfigError"
            :title="templateConfigError"
            type="error"
            :closable="false"
          />
        </el-form>
      </div>

      <!-- 步骤3: 设置试题 -->
      <div v-if="currentStep === 2" class="step-content">
        <el-form :model="formData" label-width="100px">
          <el-form-item label="班级" required>
            <el-select v-model="formData.classId" placeholder="请选择班级" style="width: 100%">
              <el-option
                v-for="item in classesList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考试说明">
            <el-input v-model="formData.examInstruction" placeholder="请输入考试说明" />
          </el-form-item>
          <el-form-item label="考试时间">
            <el-date-picker
              v-model="formData.examTimeStr"
              type="datetime"
              placeholder="选择考试时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="限时(分钟)">
            <el-input-number v-model="formData.timeLimit" :min="1" placeholder="请输入限时" />
          </el-form-item>
          <el-form-item label="试题规则">
            <div class="question-rules">
              <el-button type="primary" size="small" @click="handleAddRule">添加规则</el-button>
              <el-table :data="formData.questionRules" style="margin-top: 10px">
                <el-table-column label="题型" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.questionType" placeholder="选择题型" size="small">
                      <el-option label="单选题" :value="1" />
                      <el-option label="多选题" :value="2" />
                      <el-option label="判断题" :value="3" />
                      <el-option label="填空题" :value="4" />
                      <el-option label="简答题" :value="5" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.num" :min="1" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="每题分值" width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.perScore" :min="1" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="小计" width="100">
                  <template #default="{ row }">
                    {{ row.num * row.perScore }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default="{ $index }">
                    <el-button type="danger" size="small" link @click="handleDeleteRule($index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="total-score">总分值: {{ totalScore }}</div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤4: 查看子图 -->
      <div v-if="currentStep === 3" class="step-content">
        <div v-loading="subgraphLoading" class="subgraph-container">
          <div v-if="subgraphData">
            <KnowledgeGraphViewer :graph-data="subgraphData" />
          </div>
          <el-empty v-else description="请先生成知识子图" />
        </div>
      </div>

      <!-- 步骤5: 确认 -->
      <div v-if="currentStep === 4" class="step-content">
        <el-result icon="success" title="准备完成" sub-title="请确认以下信息后生成考试">
          <template #extra>
            <div class="confirm-info">
              <div class="info-row">
                <span class="label">核心知识点:</span>
                <span class="value">{{ selectedKnowledgeName }}</span>
              </div>
              <div class="info-row">
                <span class="label">班级:</span>
                <span class="value">{{ selectedClassName }}</span>
              </div>
              <div class="info-row">
                <span class="label">总分值:</span>
                <span class="value">{{ totalScore }}</span>
              </div>
              <div class="info-row">
                <span class="label">子图节点数:</span>
                <span class="value">{{ subgraphData?.statistics?.nodeCount || 0 }}</span>
              </div>
            </div>
          </template>
        </el-result>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="currentStep > 0" @click="handlePrevStep">上一步</el-button>
        <el-button v-if="currentStep < 3" type="primary" @click="handleNextStep">
          下一步
        </el-button>
        <el-button
          v-if="currentStep === 3 && !subgraphData"
          type="primary"
          :loading="subgraphLoading"
          @click="handleGenerateSubgraph"
        >
          生成子图
        </el-button>
        <el-button
          v-if="currentStep === 3 && subgraphData"
          type="primary"
          @click="handleNextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="currentStep === 4"
          type="primary"
          :loading="examLoading"
          @click="handleConfirmExam"
        >
          确认组卷
        </el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { debounce } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { searchKnowledgeNodes, generateSubgraph, generateExam } from '@/api/exam/intelligentExam'
import KnowledgeGraphViewer from './KnowledgeGraphViewer.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  classesList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'success'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const currentStep = ref(0)
const searchKeyword = ref('')
const knowledgeList = ref([])
const subgraphLoading = ref(false)
const examLoading = ref(false)
const subgraphData = ref(null)

const formData = ref({
  classId: null,
  examInstruction: '',
  examTimeStr: '',
  timeLimit: 120,
  coreNodeId: null,
  templateConfig: {
    maxHops: 3,
    minRelevance: 0.5,
    relationWeights: {
      prerequisite: 0.9,
      related: 0.7,
      extends: 0.6
    }
  },
  questionRules: []
})

// 搜索知识点（防抖）
const handleSearchKnowledge = debounce(async (keyword) => {
  if (!keyword || keyword.trim() === '') {
    knowledgeList.value = []
    return
  }

  try {
    const result = await searchKnowledgeNodes(keyword)
    const { code, response } = result
    if (code === 1) {
      knowledgeList.value = response || []
    } else {
      knowledgeList.value = []
    }
  } catch (error) {
    console.error('搜索知识点失败:', error)
    knowledgeList.value = []
  }
}, 300)

// 模板配置验证错误
const templateConfigError = computed(() => {
  const { maxHops, minRelevance } = formData.value.templateConfig
  if (!maxHops && !minRelevance) {
    return '跳数和关联度至少设置一个'
  }
  return ''
})

// 总分值计算
const totalScore = computed(() => {
  return formData.value.questionRules.reduce((sum, rule) => {
    return sum + (rule.num || 0) * (rule.perScore || 0)
  }, 0)
})

// 选中的知识点名称
const selectedKnowledgeName = computed(() => {
  const node = knowledgeList.value.find((item) => item.id === formData.value.coreNodeId)
  return node?.chineseName || ''
})

// 选中的班级名称
const selectedClassName = computed(() => {
  const cls = props.classesList.find((item) => item.classId === formData.value.classId)
  return cls?.className || ''
})

// 添加试题规则
function handleAddRule() {
  formData.value.questionRules.push({
    questionType: 1,
    num: 1,
    perScore: 10
  })
}

// 删除试题规则
function handleDeleteRule(index) {
  formData.value.questionRules.splice(index, 1)
}

// 下一步
function handleNextStep() {
  // 验证当前步骤
  if (currentStep.value === 0) {
    if (!formData.value.coreNodeId) {
      ElMessage.warning('请选择核心知识点')
      return
    }
  } else if (currentStep.value === 1) {
    if (templateConfigError.value) {
      ElMessage.warning(templateConfigError.value)
      return
    }
  } else if (currentStep.value === 2) {
    if (!formData.value.classId) {
      ElMessage.warning('请选择班级')
      return
    }
    if (formData.value.questionRules.length === 0) {
      ElMessage.warning('请至少添加一条试题规则')
      return
    }
  }

  currentStep.value++
}

// 上一步
function handlePrevStep() {
  // 如果从步骤4返回步骤3，清空子图数据以便重新生成
  if (currentStep.value === 4) {
    subgraphData.value = null
  }
  currentStep.value--
}

// 生成知识子图
async function handleGenerateSubgraph() {
  subgraphLoading.value = true

  try {
    const params = {
      coreNodeId: formData.value.coreNodeId,
      templateConfig: formData.value.templateConfig
    }
    console.log('生成子图请求参数:', params)
    const result = await generateSubgraph(params)
    console.log('生成子图响应:', result)
    const { code, response } = result

    if (code === 1) {
      subgraphData.value = response
      console.log('子图数据已设置:', subgraphData.value)
      ElMessage.success('知识子图生成成功')
      // 不自动跳转，让用户查看子图后手动点击"下一步"
    } else {
      ElMessage.error(result.message || '生成知识子图失败')
    }
  } catch (error) {
    console.error('生成子图错误:', error)
    ElMessage.error('生成知识子图失败: ' + (error.message || '未知错误'))
  } finally {
    subgraphLoading.value = false
  }
}

// 确认组卷
async function handleConfirmExam() {
  examLoading.value = true

  try {
    const params = {
      classId: formData.value.classId,
      examInstruction: formData.value.examInstruction,
      examTimeStr: formData.value.examTimeStr,
      timeLimit: formData.value.timeLimit,
      totalScore: totalScore.value,
      coreNodeId: formData.value.coreNodeId,
      templateConfig: formData.value.templateConfig,
      questionRules: formData.value.questionRules,
      subgraphNodeIds: subgraphData.value.nodes.map((n) => n.id)
    }
    const result = await generateExam(params)
    const { code, response } = result

    if (code === 1) {
      // 检查是否有警告信息
      if (response.warnings && response.warnings.length > 0) {
        const warningMsg = response.warnings.join('\n')
        await ElMessageBox.confirm(warningMsg + '\n\n考试已生成，但部分题型题目不足', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }

      ElMessage.success('智能组卷成功')
      emit('success')
      handleClose()
    } else {
      ElMessage.error(result.message || '智能组卷失败')
    }
  } catch (error) {
    ElMessage.error('智能组卷失败: ' + (error.message || '未知错误'))
  } finally {
    examLoading.value = false
  }
}

// 关闭对话框
function handleClose() {
  dialogVisible.value = false
  // 重置表单
  currentStep.value = 0
  searchKeyword.value = ''
  knowledgeList.value = []
  subgraphData.value = null
  formData.value = {
    classId: null,
    examInstruction: '',
    examTimeStr: '',
    timeLimit: 120,
    coreNodeId: null,
    templateConfig: {
      maxHops: 3,
      minRelevance: 0.5,
      relationWeights: {
        prerequisite: 0.9,
        related: 0.7,
        extends: 0.6
      }
    },
    questionRules: []
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  min-height: 400px;
  padding: 20px 0;
}

.step-content {
  padding: 20px;
}

.no-data-tip {
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.relation-weights {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .weight-item {
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      min-width: 80px;
    }
  }
}

.question-rules {
  width: 100%;

  .total-score {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #e95520;
    text-align: right;
  }
}

.subgraph-container {
  min-height: 500px;
}

.confirm-info {
  text-align: left;
  padding: 20px;

  .info-row {
    display: flex;
    margin-bottom: 15px;
    font-size: 14px;

    .label {
      min-width: 120px;
      color: #606266;
      font-weight: 500;
    }

    .value {
      color: #303133;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
