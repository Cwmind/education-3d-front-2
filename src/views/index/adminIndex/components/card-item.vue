<template>
  <div class="card-item">
    <div class="card-item-top">
      <div class="card-item-top-title">{{ props.title }}</div>
      <div class="card-item-top-bar"></div>
    </div>
    <div class="card-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.card-item {
  padding: 0 23px;
  background: none;
  border-radius: 4px;
  margin-bottom: 16px;
  &-top {
    width: fit-content;
    &-title {
      font-weight: 500;
      font-size: 18px;
      color: #fff;
      line-height: 16px;
      margin-bottom: 8px;
    }
    &-bar {
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
  &-content {
    padding-top: 16px;
  }
}
</style>
