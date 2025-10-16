/**
 * 获取字典维护的专业数据
 */
import { ref, onMounted } from 'vue'
import { getAllDictByType } from '@/api/basic/common'

export default function getMajorOption() {
  const majorOption = ref([])
  const loadMajorOption = async () => {
    const result = await getAllDictByType({ type: 'major' })
    const { code, response } = result
    if (code === 1 && response) {
      majorOption.value = response.children
    } else {
      majorOption.value = []
    }
  }
  onMounted(() => {
    loadMajorOption()
  })
  return {
    majorOption
  }
}
