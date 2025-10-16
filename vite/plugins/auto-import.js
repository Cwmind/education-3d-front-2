import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia'
    ],
    eslintrc: {
      // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
      enabled: true
    }
  })
}
