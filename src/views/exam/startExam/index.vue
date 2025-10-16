<template>
  <div class="start-exam">
    <start-exam-list v-if="curPage === 0" @view-detail="changeCurrPage" />
    <start-exam-detail v-else :examInfo="examInfo" @back-click="changeCurrPage" />
  </div>
</template>

<script setup>
import StartExamList from './components/start-exam-list.vue'
import StartExamDetail from './components/start-exam-detail.vue'

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
.start-exam {
  width: 100%;
  height: 100%;
}
</style>
