<template>
  <div class="screenfyll-area" @click="toggle" >
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" />
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, enter, exit, toggle } = useFullscreen();
</script>

<style lang='scss' scoped>
.screenfyll-area{
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  height: 100%;
  color: #fff;
}
</style>
