<template>
  <div class="course-detail">
    <template v-if="contentType === 'detail'">
      <BasicPageTopBottom :marginGap="16">
        <template #top>
          <course-detail-title
            ref="examDetailTitleRef"
            :courseInfo="courseInfo"
            :instruction="instruction"
            @back-click="emit('back-click', 0)"
          />
        </template>
        <template #content>
          <div class="height-100 basic-result">
            <course-detail-chapters
              ref="courseDetailChaptersRef"
              @preview-click="handlePreviewClick"
              @exam-click="handleExamClick"
            />
          </div>
        </template>
      </BasicPageTopBottom>
    </template>
    <template v-else-if="contentType === 'preview'">
      <course-detail-preview ref="courseDetailPreviewRef" @back-click="handlePreviewBackClick" />
    </template>
    <template v-else-if="contentType === 'exam'">
      <course-detail-exam ref="courseDetailExamRef" @back-click="handleExamBackClick" />
    </template>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { checkRole } from '@/utils/permission'
import { TEACHER, STUDENT } from '@/config/rolesConfig'
import CourseDetailTitle from './course-detail-title.vue'
import CourseDetailChapters from './course-detail-chapters.vue'
import CourseDetailPreview from './course-detail-preview.vue'
import CourseDetailExam from './course-detail-exam.vue'
import {
  requestCourseDetail,
  requestCoursePreviewPaper,
  requestCheckExam
} from '@/api/course/courseCenter'
import { monitorStudy } from '@/api/basic/common'

const router = useRouter()
const emit = defineEmits(['back-click'])

const props = defineProps({
  courseInfo: {
    type: Object,
    default: () => ({})
  }
})
const contentType = ref('detail')
// 上报学习时间定时器
const studyTimer = ref(null)
// 课程简介
const instruction = ref('')
// 课程详情ref
const courseDetailChaptersRef = ref(null)
// 章节目录预览ref
const courseDetailPreviewRef = ref(null)
// 章节目录考核测试ref
const courseDetailExamRef = ref(null)
// 获取课程详情
async function getCourseDetail() {
  const { courseInfo } = props
  const result = await requestCourseDetail({ courseId: courseInfo.courseId })
  const { code, response } = result
  if (code === 1) {
    instruction.value = response.instruction
    courseDetailChaptersRef.value?.setChapters(courseInfo, response.chapters)
  } else {
    instruction.value = ''
    courseDetailChaptersRef.value?.setChapters(courseInfo, [])
  }
}
// 预览章节内容详情
function handlePreviewClick(previewData) {
  contentType.value = 'preview'
  nextTick(() => {
    courseDetailPreviewRef.value?.setPreviewData(previewData)
  })
}
// 预览章节返回
function handlePreviewBackClick() {
  contentType.value = 'detail'
  getCourseDetail()
}
// 考核测试内容详情
async function handleExamClick(chapterData) {
  if (checkRole(TEACHER)) {
    handleTeacherExamClick(chapterData)
  } else if (checkRole(STUDENT)) {
    handleStudentExamClick(chapterData)
  } else {
    ElMessage.error('无操作权限!')
  }
}
async function handleTeacherExamClick(chapterData) {
  const params = {
    courseId: props.courseInfo.courseId,
    classId: props.courseInfo.classId,
    label: chapterData.chapterName
  }
  const result = await requestCoursePreviewPaper(params)
  const { code, response } = result
  if (code === 1 && response) {
    contentType.value = 'exam'
    nextTick(() => {
      courseDetailExamRef.value?.setExamData(response)
    })
  } else {
    ElMessage.warning(result.message)
  }
}
async function handleStudentExamClick(chapterData) {
  const params = {
    courseId: props.courseInfo.courseId,
    classId: props.courseInfo.classId,
    label: chapterData.chapterName
  }
  const result = await requestCheckExam(params)
  const { code, response } = result
  if (code === 1 && response) {
    router.push({
      name: 'MyExam',
      state: {
        params: {
          courseType: props.courseInfo.courseType,
          courseId: props.courseInfo.courseId
        }
      }
    })
  } else {
    ElMessage.warning('今日还未创建考试！')
  }
}
// 考核测试返回
function handleExamBackClick() {
  contentType.value = 'detail'
  getCourseDetail()
}
// 监控学习时长（学生角色）
function startMonitorStudy() {
  if (checkRole(STUDENT)) {
    clearInterval(studyTimer.value)
    const params = {
      courseType: props.courseInfo.courseType,
      classId: props.courseInfo.classId,
      courseId: props.courseInfo.courseId
    }
    studyTimer.value = setInterval(() => {
      monitorStudy(params)
    }, 1000 * 20)
    monitorStudy(params)
  }
}
onMounted(() => {
  contentType.value = 'detail'
  getCourseDetail()
  startMonitorStudy()
})
onUnmounted(() => {
  clearInterval(studyTimer.value)
})
</script>

<style lang="scss" scoped>
.course-detail {
  height: 100%;
}
</style>
