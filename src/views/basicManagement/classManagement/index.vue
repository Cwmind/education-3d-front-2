<template>
  <div class="class-management">
    <class-management-list
      v-if="curPage === 0"
      ref="classManageMentListRef"
      @view-detail="changeCurrPage"
    />
    <class-management-detail
      v-else-if="curPage === 1"
      ref="classManageMentDetailRef"
      :class-info="classInfo"
      @back-click="changeCurrPage"
    />
  </div>
</template>

<script setup>
import ClassManagementList from './components/class-management-list.vue'
import ClassManagementDetail from './components/class-management-detail.vue'

const curPage = ref(0)
const classInfo = ref({})

const changeCurrPage = (val) => {
  if (val) {
    classInfo.value = val
    curPage.value = 1
  } else {
    curPage.value = val
  }
}
</script>

<style lang="scss" scoped>
.class-management {
  width: 100%;
  height: 100%;
}
</style>
