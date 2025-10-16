<!-- 页面布局组件 左右布局 右边分为上下布局 右侧下部为主体内容 宽高根据 左侧和右侧自适应 -->
<template>
  <div class="basic-page-left-right">
    <div v-if="$slots.left" class="basic-page__left" :style="{'margin-right': props.marginGap + 'px', 'width': props.leftWidth}">
      <!--左侧内容区插槽-->
      <slot name="left"></slot>
    </div>

    <div v-if="$slots.right" class="basic-page__right">
      <!--右侧内容区插槽-->
      <slot name="right"></slot>
    </div>

    <!--默认插槽-->
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  // 左侧宽度
  leftWidth: {
    type: String,
    default: 'auto'
  },
  // 块之间间距
  marginGap: {
    type: [String, Number],
    default: 16
  }
})
</script>

<style scoped lang="scss">
.basic-page-left-right {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;

  .basic-page__left {
    flex-shrink: 0;
    background: #f8f8f8;
  }

  .basic-page__right {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}

</style>
