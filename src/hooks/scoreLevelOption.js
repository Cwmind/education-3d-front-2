/**
 * 获取字典维护的分数数据
 */
import { ref, onMounted } from 'vue'
import { getAllDictByType } from '@/api/basic/common'

export default function getScoreLevelOption() {
  const scoreLevelOption = ref([])
  const loadScoreLevelOption = async () => {
    const result = await getAllDictByType({ type: 'scoreLevel' })
    const { code, response } = result
    if (code === 1 && response) {
      scoreLevelOption.value = response.children
    } else {
      scoreLevelOption.value = []
    }
  }
  onMounted(() => {
    loadScoreLevelOption()
  })
  return {
    scoreLevelOption
  }
}
