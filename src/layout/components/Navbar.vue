<template>
  <div class="navbar">
    <div class="left-side">
      <el-space>
        <img alt="logo" src="@/assets/logo/logo-axtrem.png" />
        <span class="left-side-title">新能源锂离子电池制造工艺实训平台</span>
      </el-space>
    </div>
    <div class="center-side">
      <TopNav></TopNav>
    </div>
    <ul class="right-side">
      <li>
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar :size="33" :src="userStore.avatar" />
            <span class="avatar-username">{{ userStore.userInfo.realName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="personCenterDom" command="openPersonCenter">
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
    </ul>
    <person-center ref="personCenterRef"></person-center>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { ADMIN } from '@/config/rolesConfig'
import { checkRole } from '@/utils/permission'
import TopNav from '@/layout/components/TopNav'
import PersonCenter from '@/layout/components/PersonCenter'
import useUserStore from '@/store/modules/user'
import { onMounted } from 'vue'

const personCenterDom = ref(true)
const userStore = useUserStore()
const personCenterRef = ref(null)
function handleCommand(command) {
  switch (command) {
    case 'openPersonCenter':
      handleOpenPersonCenter()
      break
    case 'logout':
      logout()
      break
    default:
      break
  }
}
// 个人中心
function handleOpenPersonCenter() {
  personCenterRef.value.openDialog()
}
// 登出
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = '/'
      })
    })
    .catch(() => {})
}

onMounted(() => {
  if (checkRole(ADMIN)) {
    personCenterDom.value = false
  }
})
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/variables.module';

.navbar {
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: url('@/assets/images/navbar-bg.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: center;

  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 24px;
    margin-right: 32px;

    img {
      width: 113px;
      height: 32px;
    }

    .left-side-title {
      min-width: 145px;
      font-weight: bold;
      font-size: 18px;
      color: #ffffff;
      text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
      background: linear-gradient(135deg, #ffffff 0%, #e95621 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    align-items: center;
    margin-left: 32px;
    .avatar-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .avatar-username {
        margin-left: 8px;
        color: #fff;
      }
    }
  }
}
</style>
