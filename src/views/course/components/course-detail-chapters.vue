<template>
  <div class="course-detail-chapters">
    <el-tabs v-model="activeName" class="chapters-tabs" @tab-click="handleClick">
      <el-tab-pane label="课程章节" name="chapters">
        <div class="chapters-list">
          <div v-for="item in chaptersList" :key="item" class="chapter-item">
            <div class="chapter-name" @click="handleChapterClick(item, 'chapter')">
              {{ item.chapterName }}
            </div>
            <div
              v-if="item.videoName"
              class="chapter-data"
              @click="handleChapterClick(item, 'video')"
            >
              <img src="@/assets/images/course/videos-icon.png" alt="" />
              <span>{{ item.videoName }}</span>
            </div>
            <div v-if="item.docName" class="chapter-data" @click="handleChapterClick(item, 'doc')">
              <img src="@/assets/images/course/pdf-icon.png" alt="" />
              <span>{{ item.docName }}</span>
            </div>
            <div v-if="item.examOperate" class="chapter-data" @click="handleExamClick(item)">
              <img src="@/assets/images/course/exam-icon.png" alt="" />
              <span>{{ item.examOperate }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="评论" name="comment">
        <div class="comment-content">
          <div class="content-operator">
            <el-select v-model="selectChapter" style="width: 280px" @change="handleChange">
              <el-option
                v-for="item in chapterSelectList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <span>评分</span>
            <div class="content-operator-rate">
              <el-rate v-model="selectChapterRate" text-color="#333333" show-score allow-half />
            </div>
            <el-button type="primary" style="margin-left: 16px" @click="addChapterRate">
              添加评分
            </el-button>
          </div>
          <div class="content-list">
            <div v-for="item in courseScoreList" :key="item" class="content-item">
              <div class="content-item-left">
                <img src="@/assets/index/students-num.png" alt="" />
              </div>
              <div class="content-item-right">
                <div class="content-item-right-top">
                  <span class="content-item-right-top-name">{{ item.label }}</span>
                  <span class="content-item-right-top-time">{{ item.createTime }}</span>
                </div>
                <div class="content-item-right-bottom">
                  <el-rate
                    v-model="item.courseScore"
                    text-color="#333333"
                    disabled
                    show-score
                    allow-half
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { requestChapterSelectList, requestCourseScoreList } from '@/api/course/courseCenter'
import { requestGradeTheCourse } from '@/api/practical/practicalTeaching'

const emit = defineEmits(['preview-click', 'exam-click'])
const activeName = ref('chapters')
const courseInfo = ref({})
const chaptersList = ref([])
// 评论信息
const selectChapter = ref('')
const chapterSelectList = ref([])
const selectChapterRate = ref(0)
const courseScoreList = ref([])
// 设置章节数据
function setChapters(info, chapters) {
  courseInfo.value = info
  chaptersList.value = chapters
}
// 切换Tabs标签
function handleClick() {
  if (activeName.value === 'comment') {
    selectChapterRate.value = 0
    getChapterSelectList()
  }
}
// 获取章节列表
async function getChapterSelectList() {
  const result = await requestChapterSelectList({
    courseId: courseInfo.value.courseId
  })
  const { code, response } = result
  if (code === 1) {
    chapterSelectList.value = response
    if (response?.length > 0) {
      selectChapter.value = response[0]
      getCourseScoreList()
    }
  } else {
    chapterSelectList.value = []
    selectChapter.value = ''
  }
}
// 选择章节
function handleChange() {
  getCourseScoreList()
}
// 添加评分
async function addChapterRate() {
  const result = await requestGradeTheCourse({
    courseType: courseInfo.value.courseType,
    courseId: courseInfo.value.courseId,
    classId: courseInfo.value.classId,
    label: selectChapter.value,
    courseScore: selectChapterRate.value,
    teacherUuid: courseInfo.value.teacherUuid
  })
  const { code } = result
  if (code === 1) {
    getCourseScoreList()
    selectChapterRate.value = 0
    ElMessage.success('添加评分成功')
  } else {
    ElMessage.warning(result.message)
  }
}
// 获取评分列表
async function getCourseScoreList() {
  const result = await requestCourseScoreList({
    courseId: courseInfo.value.courseId,
    label: selectChapter.value
  })
  const { code, response } = result
  if (code === 1) {
    courseScoreList.value = response
  } else {
    courseScoreList.value = []
  }
}
// 章节目录点击事件
function handleChapterClick(item, type) {
  emit('preview-click', {
    chapterData: item,
    clickType: type
  })
}
// 点击查看考核
function handleExamClick(item) {
  emit('exam-click', item)
}

defineExpose({
  setChapters
})
</script>

<style lang="scss" scoped>
.course-detail-chapters {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  .chapters-tabs {
    height: 100%;
    :deep(.el-tabs__header) {
      margin: 0 0 24px;
    }
    :deep(.el-tabs__content) {
      padding: 0 24px 24px;
    }
    :deep(.el-tabs__nav-scroll) {
      padding: 16px 24px 0 24px;
    }
    :deep(.el-tabs__item) {
      height: 22px;
      margin: 13px 16px;
      padding: 0;
    }
    :deep(.el-tab-pane) {
      height: 100%;
    }
    .chapters-list {
      height: 100%;
      overflow-y: auto;
      .chapter-item {
        height: 174px;
        background: #ffffff;
        border-radius: 2px;
        margin-bottom: 16px;
        padding: 16px;
        .chapter-name {
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          margin-bottom: 16px;
          cursor: pointer;
        }
        .chapter-data {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          cursor: pointer;
          img {
            width: 32px;
            height: 32px;
            margin-right: 8px;
          }
          span {
            font-weight: 400;
            font-size: 14px;
            color: #000000;
            line-height: 21px;
          }
        }
      }
    }
    .comment-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .content-operator {
        height: 40px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        span {
          margin-left: 16px;
          margin-right: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #000000;
        }
        .content-operator-rate {
          width: 140px;
        }
      }
      .content-list {
        flex: 1;
        overflow-y: auto;
        .content-item {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          .content-item-left {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            img {
              width: 20px;
              height: 20px;
            }
          }
          .content-item-right {
            display: flex;
            flex-direction: column;
            .content-item-right-top {
              .content-item-right-top-name {
                font-weight: 400;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.4);
                line-height: 21px;
                margin-right: 19px;
              }
              .content-item-right-top-time {
                font-weight: 400;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.4);
                line-height: 18px;
              }
            }
          }
        }
      }
      :deep(.el-rate .el-rate__icon) {
        margin-right: 2px;
        font-size: 20px;
      }
      :deep(.el-rate__text) {
        font-weight: bold;
        font-size: 14px;
        color: #000000;
        margin-left: 4px;
      }
      :deep(.el-rate.is-disabled .el-rate__item) {
        color: #cdd0d6;
      }
    }
  }
}
</style>
