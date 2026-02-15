<template>
  <BasicPageTopBottom :marginGap="1">
    <template #top>
      <el-card shadow="never" body-class="error-analysis-header">
        <div class="report-summary">
          <div class="summary-title">错题分析报告</div>
          <div class="summary-info">
            <div class="info-item">
              <span class="label">考试场次：</span>
              <span class="value">{{ reportData.examCount || 0 }} 场</span>
            </div>
            <div class="info-item">
              <span class="label">总错题数：</span>
              <span class="value error-count">{{ reportData.totalErrorCount || 0 }} 题</span>
            </div>
            <div class="info-item">
              <span class="label">薄弱知识点：</span>
              <span class="value">{{ reportData.weakKnowledgePoints?.length || 0 }} 个</span>
            </div>
          </div>
          <div v-if="reportData.weakKnowledgePoints?.length > 0" class="top-selector">
            <span class="selector-label">显示 TOP</span>
            <el-input
              v-model.number="selectedTopN"
              type="number"
              :min="1"
              :max="99"
              size="small"
              style="width: 80px"
              @input="handleTopNInput"
            />
            <span class="selector-label">个薄弱知识点</span>
          </div>
        </div>
      </el-card>
    </template>
    <template #content>
      <el-card v-loading="loading" shadow="never" body-class="error-analysis-content">
        <div v-if="!loading && displayedKnowledgePoints.length === 0" class="empty-state">
          <el-empty description="暂无错题数据" />
        </div>
        <div v-else class="knowledge-points-list">
          <div
            v-for="(kp, index) in displayedKnowledgePoints"
            :key="kp.knowledgePointId"
            class="knowledge-point-card"
          >
            <div class="kp-header">
              <div class="kp-rank">{{ index + 1 }}</div>
              <div class="kp-info">
                <div class="kp-name">{{ kp.knowledgePointName }}</div>
                <div class="kp-stats">
                  <el-tag type="danger" size="small">错误 {{ kp.errorCount }} 次</el-tag>
                </div>
              </div>
              <div class="kp-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleViewResources(kp)"
                >
                  查看资源
                </el-button>
                <el-button
                  :type="expandedKpIds.includes(kp.knowledgePointId) ? 'info' : 'default'"
                  size="small"
                  @click="toggleExpand(kp.knowledgePointId)"
                >
                  {{ expandedKpIds.includes(kp.knowledgePointId) ? '收起错题' : '展开错题' }}
                </el-button>
              </div>
            </div>

            <el-collapse-transition>
              <div v-show="expandedKpIds.includes(kp.knowledgePointId)" class="kp-questions">
                <div
                  v-for="question in kp.errorQuestions"
                  :key="question.questionId"
                  class="question-item"
                >
                  <div class="question-header">
                    <el-tag size="small">{{ getQuestionTypeName(question.questionType) }}</el-tag>
                    <span class="exam-name">来源：{{ question.examName }}</span>
                  </div>
                  <div class="question-content">
                    <div class="content-label">题目：</div>
                    <div class="content-text" v-html="question.questionContent"></div>
                  </div>
                  <div class="question-answer">
                    <div class="answer-item">
                      <span class="answer-label error">你的答案：</span>
                      <span class="answer-value">{{ question.studentAnswer || '未作答' }}</span>
                    </div>
                    <div class="answer-item">
                      <span class="answer-label correct">正确答案：</span>
                      <span class="answer-value">{{ question.correctAnswer }}</span>
                    </div>
                  </div>
                  <div v-if="question.analysis" class="question-analysis">
                    <div class="analysis-label">解析：</div>
                    <div class="analysis-text">{{ question.analysis }}</div>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </el-card>
    </template>
  </BasicPageTopBottom>

  <!-- 资源弹窗 -->
  <el-dialog
    v-model="resourceDialogVisible"
    :title="`${currentKp?.knowledgePointName} - 学习资源`"
    width="600px"
  >
    <div v-loading="resourceLoading" class="resource-content">
      <div v-if="currentResources.description" class="resource-description">
        <div class="description-label">知识点描述：</div>
        <div class="description-text">{{ currentResources.description }}</div>
      </div>

      <div v-if="currentResources.links && currentResources.links.length > 0" class="resource-section">
        <div class="section-title">🔗 相关链接</div>
        <div class="resource-list">
          <div
            v-for="(link, index) in currentResources.links"
            :key="index"
            class="resource-item"
          >
            <a :href="link" target="_blank" class="resource-link">
              {{ link }}
            </a>
          </div>
        </div>
      </div>

      <div v-if="!currentResources.description && (!currentResources.links || currentResources.links.length === 0)" class="empty-resources">
        <el-empty description="暂无学习资源" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { requestErrorReport, requestKnowledgeResources } from '@/api/exam/errorAnalysis'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const reportData = ref({
  totalErrorCount: 0,
  examCount: 0,
  weakKnowledgePoints: []
})

// TOP 数量选择
const selectedTopN = ref(3)

// 验证并更新 TOP 数量
function handleTopNInput(value) {
  // 确保是数字
  const num = parseInt(value)
  if (isNaN(num) || num < 1) {
    selectedTopN.value = 1
    return
  }
  // 限制范围 1-99
  if (num > 99) {
    selectedTopN.value = 99
  }
}

// 展开的知识点ID列表
const expandedKpIds = ref([])

// 资源弹窗
const resourceDialogVisible = ref(false)
const resourceLoading = ref(false)
const currentKp = ref(null)
const currentResources = ref({})

// 计算默认显示数量
function getDefaultTopCount(totalErrors) {
  if (totalErrors <= 8) return 3
  if (totalErrors <= 12) return 4
  return 5
}

// 显示的知识点列表
const displayedKnowledgePoints = computed(() => {
  return reportData.value.weakKnowledgePoints?.slice(0, selectedTopN.value) || []
})

// 获取题目类型名称
function getQuestionTypeName(type) {
  const typeMap = {
    1: '单选题',
    2: '多选题',
    3: '判断题',
    4: '填空题',
    5: '简答题'
  }
  return typeMap[type] || '未知类型'
}

// 切换展开/收起
function toggleExpand(kpId) {
  const index = expandedKpIds.value.indexOf(kpId)
  if (index > -1) {
    expandedKpIds.value.splice(index, 1)
  } else {
    expandedKpIds.value.push(kpId)
  }
}

// 查看资源
async function handleViewResources(kp) {
  currentKp.value = kp
  resourceDialogVisible.value = true
  resourceLoading.value = true
  currentResources.value = {}

  try {
    const result = await requestKnowledgeResources(kp.knowledgePointId)
    if (result.code === 1) {
      currentResources.value = result.response
    } else {
      ElMessage.warning(result.message || '获取资源失败')
    }
  } catch (error) {
    console.error('fetchResources error', error)
    ElMessage.error('获取资源失败')
  } finally {
    resourceLoading.value = false
  }
}

// 加载报告数据
async function loadReport() {
  const examIdsParam = route.query.examIds
  if (!examIdsParam) {
    ElMessage.error('缺少考试ID参数')
    router.back()
    return
  }

  const examIds = examIdsParam.split(',').map(id => parseInt(id))

  loading.value = true
  try {
    const result = await requestErrorReport({ examIds })
    if (result.code === 1) {
      reportData.value = result.response
      // 设置默认显示数量（根据总错题数）
      const defaultTopN = getDefaultTopCount(reportData.value.totalErrorCount || 0)
      selectedTopN.value = defaultTopN
    } else {
      ElMessage.error(result.message || '生成报告失败')
      router.back()
    }
  } catch (error) {
    console.error('loadReport error', error)
    ElMessage.error('生成报告失败')
    router.back()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReport()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}

.error-analysis-header {
  padding: 24px;
}

.report-summary {
  .summary-title {
    font-size: 20px;
    font-weight: 600;
    color: #000;
    margin-bottom: 16px;
  }

  .summary-info {
    display: flex;
    gap: 32px;
    margin-bottom: 16px;

    .info-item {
      .label {
        color: #666;
        font-size: 14px;
      }

      .value {
        color: #000;
        font-size: 16px;
        font-weight: 500;
        margin-left: 8px;

        &.error-count {
          color: #e95520;
        }
      }
    }
  }

  .top-selector {
    display: flex;
    align-items: center;
    gap: 8px;

    .selector-label {
      color: #666;
      font-size: 14px;
    }
  }
}

.error-analysis-content {
  padding: 24px;
  min-height: 400px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.knowledge-points-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-point-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .kp-header {
    display: flex;
    align-items: center;
    gap: 16px;

    .kp-rank {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e95520 0%, #ff7a45 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .kp-info {
      flex: 1;

      .kp-name {
        font-size: 16px;
        font-weight: 500;
        color: #000;
        margin-bottom: 8px;
      }

      .kp-stats {
        display: flex;
        gap: 8px;
      }
    }

    .kp-actions {
      display: flex;
      gap: 8px;
    }
  }

  .kp-questions {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e8e8e8;
  }
}

.question-item {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .exam-name {
      color: #666;
      font-size: 13px;
    }
  }

  .question-content {
    margin-bottom: 12px;

    .content-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .content-text {
      color: #000;
      font-size: 14px;
      line-height: 1.6;
    }
  }

  .question-answer {
    display: flex;
    gap: 24px;
    margin-bottom: 12px;

    .answer-item {
      .answer-label {
        font-size: 13px;
        margin-right: 8px;

        &.error {
          color: #e95520;
        }

        &.correct {
          color: #52c41a;
        }
      }

      .answer-value {
        font-size: 14px;
        font-weight: 500;
        color: #000;
      }
    }
  }

  .question-analysis {
    padding-top: 12px;
    border-top: 1px dashed #ddd;

    .analysis-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .analysis-text {
      color: #000;
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.resource-content {
  min-height: 200px;

  .resource-description {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f8f8;
    border-radius: 6px;

    .description-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .description-text {
      color: #000;
      font-size: 14px;
      line-height: 1.6;
    }
  }

  .resource-section {
    margin-bottom: 20px;

    .section-title {
      font-size: 15px;
      font-weight: 500;
      color: #000;
      margin-bottom: 12px;
    }

    .resource-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .resource-item {
      padding: 12px;
      background: #f8f8f8;
      border-radius: 6px;

      .resource-link {
        color: #1890ff;
        text-decoration: none;
        font-size: 14px;
        word-break: break-all;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .empty-resources {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
}
</style>
