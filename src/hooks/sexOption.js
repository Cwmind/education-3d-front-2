/**
 * 获取字典维护的性别数据
 */
import { ref, onMounted } from 'vue'
import { getAllDictByType } from '@/api/basic/common'

export default function getSexOption() {
  const sexOption = ref([])
  const loadSexOption = async () => {
    const result = await getAllDictByType({ type: 'sex' })
    const { code, response } = result
    if (code === 1 && response) {
      sexOption.value = response.children
    } else {
      sexOption.value = []
    }
  }
  onMounted(() => {
    loadSexOption()
  })
  return {
    sexOption
  }
}
