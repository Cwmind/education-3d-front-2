<template>
  <BasicPageTopBottom :marginGap="10">
    <template #top>
      <div class="my-course-top">
        <card-item title="学习时长">
          <study-time />
        </card-item>
      </div>
    </template>
    <template #content>
      <el-card shadow="never" body-class="my-course-list" class="basic-table-card">
        <div class="height-100 basic-result">
          <div class="basic-result__header">
            <div class="left-title">课程信息</div>
            <div class="left-bar"></div>
          </div>
          <div
            v-if="queryDataList.length > 0"
            v-loading="contentLoading"
            class="basic-result__body"
          >
            <template v-for="item in queryDataList" :key="item">
              <course-item :courseInfo="item" @course-detail="loadCourseDetail(item)" />
            </template>
          </div>
          <BasicNoData v-else />
          <div class="basic-result__pagination">
            <div class="pagination--tip">共 {{ total }} 条记录</div>
            <el-pagination
              v-model:current-page="pageParams.pageIndex"
              :page-size="pageParams.pageSize"
              background
              :total="total"
              :default-page-size="9"
              layout="sizes, prev, pager, next, jumper"
              :page-sizes="[9, 18, 45, 90]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </el-card>
    </template>
  </BasicPageTopBottom>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardItem from './card-item.vue'
import StudyTime from './study-time.vue'
import CourseItem from './course-item.vue'
import { requestmyCoursePage, requestCourseStartStudy } from '@/api/course/myCourse'

const emit = defineEmits(['view-detail'])
const contentLoading = ref(false)
const queryDataList = ref([])
const pageParams = ref({
  pageIndex: 1,
  pageSize: 9
})
const total = ref(0)

// 获取我的课程列表
async function getMyCourseList() {
  const params = {
    ...pageParams.value
  }
  contentLoading.value = true
  const result = await requestmyCoursePage(params)
  contentLoading.value = false
  const { code, response } = result
  if (code === 1) {
    const { list, total: listTotal } = response
    queryDataList.value = list
    total.value = listTotal
  } else {
    queryDataList.value = []
    total.value = 0
  }
}
// 我的课程分页
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getMyCourseList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getMyCourseList()
}
// 查看课程详情
function loadCourseDetail(item) {
  const { courseId, classId } = item
  requestCourseStartStudy({ courseId, classId })
  emit('view-detail', item)
}

onMounted(() => {
  getMyCourseList()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.my-course-top {
  width: 100%;
  height: 100%;
}
.basic-result__header {
  width: 100%;
  .left-title {
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    line-height: 16px;
    margin-bottom: 8px;
  }
  .left-bar {
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
  }
}
.basic-result__body {
  flex: 1;
  overflow: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 16px;
  place-items: center;
  align-content: baseline;
}
.basic-result__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .pagination--tip {
    width: 203px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
  }
}
</style>
<style lang="scss">
.my-course-list {
  padding: 10px 24px 10px 24px
}
</style>
