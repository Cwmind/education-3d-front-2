<template>
  <div class="my-practical">
    <my-practical-list v-if="curPage === 0" @view-detail="changeCurrPage" />
    <practical-detail
      v-else-if="curPage === 1"
      :practicalInfo="practicalInfo"
      @back-click="changeCurrPage"
    />
  </div>
</template>

<script setup>
import MyPracticalList from './components/my-practical-list.vue'
import PracticalDetail from '../components/practical-detail.vue'

const curPage = ref(0)
const practicalInfo = ref({})

const changeCurrPage = (val) => {
  if (val) {
    practicalInfo.value = val
    curPage.value = 1
  } else {
    curPage.value = val
  }
}
</script>

<style lang="scss" scoped>
.my-practical {
  width: 100%;
  height: 100%;
}
</style>
