<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="microKeepList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
// 缓存页面
const microKeepList = []
</script>

<style lang="scss" scoped>

</style>
