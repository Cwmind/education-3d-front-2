<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    :ellipsis="false"
    background-color="transparent"
    text-color="#D2D2D2"
    active-text-color="#FFFFFF"
    class="topmenu-container"
    popper-class="custom-menu-popper"
  >
    <template v-for="item in menuTree">
      <el-sub-menu v-if="item.children && item.children.length !== 0" :index="item.name">
        <template #title>
          <span> {{ item.meta.title }}</span>
        </template>
        <template v-for="child in item.children">
          <el-menu-item @click="handleMenuSelect(child)" :index="child.name">
            <template #title>
              <div class="custom-menu-item">
                <div class="custom-menu-item__left">
                  <svg-icon
                    v-if="child.meta && child.meta.icon && child.meta.icon !== '#'"
                    className="menu-icon"
                    :icon-class="child.meta.icon"
                  />
                  <span> {{ child.meta.title }}</span>
                </div>
                <div class="custom-menu-item__right">
                  <el-icon v-if="activeMenu === child.meta.activeMenu" :size="15">
                    <Select />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="item.name" @click="handleMenuSelect(item)">
        <span> {{ item.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { constantRoutes } from '@/router'
import { isHttp } from '@/utils/validate'
import useAppStore from '@/store/modules/app'
import usePermissionStore from '@/store/modules/permission'

// 顶部栏初始数
const visibleNumber = ref(null)
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

// 所有的路由信息
const menuTree = computed(() => permissionStore.topbarRouters)

function handleMenuSelect(item) {
  const { activeMenu } = item.meta
  if (route.name === item.name) {
    return
  }
  router.push({
    name: item.name
  })
}

function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3
  visibleNumber.value = parseInt(width / 85)
}

onMounted(() => {
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
})

onMounted(() => {
  setVisibleNumber()
})
</script>

<style lang="scss">
.topmenu-container {
  border-bottom: none !important;

  :deep(.el-menu-item) {
    border-bottom: none !important;
  }

  .el-menu-item.is-active {
    background-color: transparent !important;
    font-weight: 500;
    border-bottom: 2px solid #ff875c !important;
  }

  .el-sub-menu.is-active .el-sub-menu__title {
    font-weight: 500;
    border-bottom: 2px solid #ff875c !important;
  }

  .el-menu-item {
    font-weight: 400;
    font-size: 16px;
    padding-top: 4px;
    margin-right: 26px;
  }
  .el-sub-menu {
    font-weight: 400;
    font-size: 16px;
    padding-top: 4px;
    margin-right: 26px;
  }

  .el-sub-menu__title {
    font-weight: 400;
    font-size: 16px;
  }
}
.el-menu--popup {
  min-width: 148px !important;
  border-radius: 5px;
  padding: 7px 7px;
}
.custom-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  &__left {
    display: flex;
    align-items: center;
    .menu-icon {
      width: 22px !important;
      height: 22px !important;
    }
  }
  &__right {
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
}
.custom-menu-popper {
  border: 1px solid #202020 !important;
  background: #202020 !important;
}
</style>
