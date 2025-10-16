import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import EslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  if (isBuild) {
    vitePlugins.push(...createCompression(viteEnv))
  }

  vitePlugins.push(VueI18nPlugin({
    runtimeOnly: true,
    compositionOnly: true,
    globalSFCLang: true,
    include: [resolve('src/locales/lang')]
  }))
  vitePlugins.push(EslintPlugin({
    cache: false,
    include: ['src/**/*.vue'] // 检查的文件
  }))
  return vitePlugins
}
