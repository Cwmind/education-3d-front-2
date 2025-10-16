<!-- 暂无数据 -->
<template>
  <div class="basic-flex-center width-100">
    <img v-if="theme === 'light'" src="@/assets/images/no-data.png" />
    <span v-else :class="'no-data-text-' + props.theme">暂无数据</span>
  </div>
</template>

<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: 'light'
  }
})
</script>

<style scoped lang="scss">
.width-100 {
  height: 100%;
  img{
    width: 180px;
    height: 180px;
  }
}
.no-data-text-dark {
  color: #ddd;
}
.no-data-text-light {
  color: #fff;
}
</style>
