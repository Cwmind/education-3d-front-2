<!-- 暂无数据div -->
<template>
  <div :class="{'no-data-container': props.showNoData}">
    <img v-if="props.showNoData" src="@/assets/images/no-data.png" alt="No Data" />
    <slot v-else></slot>
  </div>
</template>

<script setup>

// 定义 props
const props = defineProps({
  showNoData: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    default: 'light'
  }
})

</script>

<style scoped>
.no-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 根据需要添加更多样式 */
}
</style>
