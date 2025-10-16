<template>
  <div class="basic-page-top-bottom">
    <div
      v-if="$slots.top"
      class="basic-page__right-top"
      :style="{ 'margin-bottom': props.marginGap + 'px' }"
    >
      <!--上方内容区插槽-->
      <slot name="top"></slot>
    </div>

    <div class="basic-page__right-content">
      <!--下方内容区插槽-->
      <slot name="content"></slot>
    </div>

    <!--默认插槽-->
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  // 块之间间距
  marginGap: {
    type: [String, Number],
    default: 16
  }
})
</script>

<style scoped lang="scss">
.basic-page-top-bottom {
  display: flex;
  height: 100%;
  overflow-x: hidden;
  justify-content: space-between;
  flex-direction: column;

  .basic-page__right-top {
    flex-shrink: 0;
    width: 100%;
    background-color: transparent;
  }

  .basic-page__right-content {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #f8f8f8;
  }
}
</style>
