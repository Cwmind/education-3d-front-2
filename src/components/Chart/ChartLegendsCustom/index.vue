<!-- 自定义绘制图例组件 -->
<template>
  <div class="basic-fake-chart-legends">
    <div v-for="(item,index) in props.data" :key="index" class="basic-fake-chart-legends__item">
      <div :class=" 'legend-' + item.shape" :style="{background:item.color}"></div>
      <span class="legend-text">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
/* 自定义图例
*  示例配置
* [{
    label: '', // 文本
    class: 'square', // 图例形状 square 方形 circle 圆形 line 线条
    color: '' // 图例颜色 可以传色值 #000 也可以传css渐变  linear-gradient( 180deg, #00AAFF 0%, rgba(0,170,255,0) 100%)
  }]
*/

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

</script>

<style scoped lang="scss">
.basic-fake-chart-legends{
  position: absolute;
  right: 16px;
  top: 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  &__item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 16px;
  }
  .legend-square{
    width: 12px;
    height: 12px;
  }
  .legend-line{
    width: 12px;
    height: 2px;
  }
  .legend-circle{
    width: 12px;
    height: 12px;
    border-radius: 6px;
  }
  .legend-text{
    margin-left: 4px;
    font-size: 14px;
  }
}
</style>
