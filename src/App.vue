<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { handleThemeStyle } from '@/utils/theme'
import { setToken } from '@/utils/auth'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import enUS from 'element-plus/es/locale/lang/en'
import useLocale from '@/hooks/locale'

const route = useRouter()

if (window.__MICRO_APP_ENVIRONMENT__) {
  // 判断是否微前端环境中
  window.microApp.addDataListener((data) => {
    setToken(data.token) // todo 此处应该是需要若依的token
    data?.path ? route.push(data.path) : ''
  }, true)
}

const { currentLocale } = useLocale()
const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN
    case 'en-US':
      return enUS
    default:
      return zhCN
  }
})

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle('#ff875c')
  })
})
</script>
