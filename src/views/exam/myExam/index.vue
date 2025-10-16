<template>
  <div class="my-exam">
    <my-exam-list v-if="curPage === 0" @view-detail="changeCurrPage" />
    <my-exam-detail v-else :examInfo="examInfo" @back-click="changeCurrPage" />
  </div>
</template>

<script setup>
import MyExamList from './components/my-exam-list.vue'
import MyExamDetail from './components/my-exam-detail.vue'

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
.my-exam {
  width: 100%;
  height: 100%;
}
</style>
