<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div :class="{ 'fixed-header': fixedHeader }">
      <navbar @setLayout="setLayout" />
    </div>
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <tags-view v-if="needTagsView" />
      <app-main />
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { AppMain, Navbar, TagsView } from './components'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme)
const sideTheme = computed(() => settingsStore.sideTheme)
const sidebar = computed(() => useAppStore().sidebar)
const device = computed(() => useAppStore().device)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const classObj = computed(() => ({
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const { width, height } = useWindowSize()
const WIDTH = 992

watchEffect(() => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice('mobile')
    useAppStore().closeSideBar({ withoutAnimation: true })
  } else {
    useAppStore().toggleDevice('desktop')
  }
})

const settingRef = ref(null)
function setLayout() {
  settingRef.value.openSetting()
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin';
@import '@/assets/styles/variables.module';

.app-wrapper {
  @include clearfix;

  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100% !important;
  height: $navbar-header-height;
}
</style>
