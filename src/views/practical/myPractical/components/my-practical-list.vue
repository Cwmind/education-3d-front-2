<template>
  <BasicPageTopBottom :marginGap="10">
    <template #top>
      <div class="my-practical-top">
        <card-item title="实训软件进度">
          <practical-progress :progressData="progressData" />
        </card-item>
        <card-item title="学习时长">
          <study-time />
        </card-item>
      </div>
    </template>
    <template #content>
      <el-card shadow="never" body-class="my-practical-list" class="basic-table-card">
        <div class="height-100 basic-result">
          <div class="basic-result__header">
            <div class="left-title">实训信息</div>
            <div class="left-bar"></div>
          </div>
          <div
            v-if="queryDataList.length > 0"
            v-loading="contentLoading"
            class="basic-result__body"
          >
            <template v-for="(item, index) in queryDataList" :key="index">
              <practical-item :practicalInfo="item" @practical-detail="loadPracticalDetail(item)" />
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
import PracticalProgress from './practical-progress.vue'
import StudyTime from './study-time.vue'
import PracticalItem from './practical-item.vue'
import {
  requestMyPracticalPage,
  requestStartPractical,
  requestSxrjProgress
} from '@/api/practical/myPractical'

const emit = defineEmits(['view-detail'])
const progressData = ref({})

const contentLoading = ref(false)
const queryDataList = ref([])
const pageParams = ref({
  pageIndex: 1,
  pageSize: 9
})
const total = ref(0)

// 获取我的实训列表
async function getMyPracticalList() {
  const params = {
    ...pageParams.value
  }
  contentLoading.value = true
  const result = await requestMyPracticalPage(params)
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
// 实训列表分页
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getMyPracticalList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getMyPracticalList()
}
// 加载实训详情
function loadPracticalDetail(item) {
  const { courseId, classId } = item
  requestStartPractical({ courseId, classId })
  emit('view-detail', item)
}
// 获取实训软件进度
async function getSxrjProgress() {
  const result = await requestSxrjProgress()
  const { code, response } = result
  if (code === 1) {
    progressData.value = response
  } else {
    progressData.value = {
      totalClass: 0,
      studyClass: 0,
      totalProgress: 0
    }
  }
}

onMounted(() => {
  getSxrjProgress()
  getMyPracticalList()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.my-practical-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  gap: 16px;
  margin-top: 8px;
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
.my-practical-list {
  padding: 10px 24px 24px 24px
}
</style>
