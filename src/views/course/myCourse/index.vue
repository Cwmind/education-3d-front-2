<template>
  <div class="my-course">
    <my-course-list v-if="curPage === 0" @view-detail="changeCurrPage" />
    <course-detail
      v-else-if="curPage === 1"
      :courseInfo="courseInfo"
      @back-click="changeCurrPage"
    />
  </div>
</template>

<script setup>
import MyCourseList from './components/my-course-list.vue'
import CourseDetail from '../components/course-detail.vue'

const curPage = ref(0)
const courseInfo = ref({})

const changeCurrPage = (val) => {
  if (val) {
    courseInfo.value = val
    curPage.value = 1
  } else {
    curPage.value = val
  }
}
</script>

<style lang="scss" scoped>
.my-course {
  width: 100%;
  height: 100%;
}
</style>
