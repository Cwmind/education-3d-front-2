<template>
  <div class="exam-management">
    <exam-management-list v-if="curPage === 0" @view-detail="changeCurrPage" />
    <exam-management-detail v-else :exam-info="examInfo" @back-click="changeCurrPage" />
  </div>
</template>

<script setup>
import ExamManagementList from './components/exam-management-list.vue'
import ExamManagementDetail from './components/exam-management-detail.vue'

const curPage = ref(0)
const examInfo = ref({})

const changeCurrPage = (val) => {
  if (val) {
    examInfo.value = val
    curPage.value = 1
  } else {
    curPage.value = val
  }
}
</script>

<style lang="scss" scoped>
.exam-management {
  width: 100%;
  height: 100%;
}
</style>
