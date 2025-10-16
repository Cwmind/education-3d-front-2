<template>
  <section class="app-main">
    <div class="app-container">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <iframe-toggle />
  </section>
</template>

<script setup>

import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
</script>

<style lang="scss" scoped>
@import "src/assets/styles/variables.module";

.app-main {
  position: relative;
  width: 100%;

  /* 50= navbar  50  */
  min-height: calc(100vh - $navbar-header-height);
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - $navbar-header-height - $tag-bar-height);
  }

  .fixed-header + .app-main {
    padding-top: $navbar-header-height + $tag-bar-height;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
// .el-popup-parent--hidden {
//   .fixed-header {
//     padding-right: 1px;
//   }
// }

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

// ::-webkit-scrollbar-track {
//   background-color: #05080A;
// }

::-webkit-scrollbar-thumb {
  background-color: rgba(255,255,255,0.2);
  border-radius: 3px;
}
</style>

