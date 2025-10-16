<template>
  <BasicPageLeftRight :marginGap="16">
    <template #left>
      <div class="height-100 preview-left">
        <div class="container-back" @click="handleBackClick">
          <img src="@/assets/images/back-icon.png" alt="" />
          <span>返回上一级</span>
        </div>
        <div class="container-chapter">
          <div class="chapter-name">
            {{ chapterInfo.chapterName }}
          </div>
          <div
            v-if="chapterInfo.videoName"
            class="chapter-data"
            @click="handleChapterClick('video')"
          >
            <img src="@/assets/images/course/videos-icon.png" alt="" />
            <span>{{ chapterInfo.videoName }}</span>
          </div>
          <div v-if="chapterInfo.docName" class="chapter-data" @click="handleChapterClick('doc')">
            <img src="@/assets/images/course/pdf-icon.png" alt="" />
            <span>{{ chapterInfo.docName }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <div class="height-100 preview-right">
        <div v-if="contentType === 'video'" class="chapter-video">
          <video :src="contentUrl" autoplay controls class="video"></video>
        </div>
        <div v-else class="chapter-doc">
          <iframe :src="contentUrl + '#toolbar=0'" frameborder="0" class="doc"></iframe>
        </div>
      </div>
    </template>
  </BasicPageLeftRight>
</template>

<script setup>
const emit = defineEmits(['back-click'])
const contentType = ref('')
const contentUrl = ref('')
const chapterInfo = ref({})

// 设置预览数据
function setPreviewData(data) {
  const { clickType, chapterData } = data
  chapterInfo.value = chapterData
  if (clickType === 'chapter' || clickType === 'video') {
    contentType.value = 'video'
    contentUrl.value = chapterData.videoPath
  } else if (clickType === 'doc') {
    contentType.value = 'doc'
    contentUrl.value = chapterData.docPath
  }
}
function handleChapterClick(type) {
  if (type === 'video') {
    contentType.value = 'video'
    contentUrl.value = chapterInfo.value.videoPath
  } else if (type === 'doc') {
    contentType.value = 'doc'
    contentUrl.value = chapterInfo.value.docPath
  }
}
// 返回上一级
function handleBackClick() {
  emit('back-click')
}

defineExpose({
  setPreviewData
})
</script>

<style lang="scss" scoped>
.preview-left {
  width: 368px;
  padding: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  .container-back {
    font-weight: 500;
    font-size: 16px;
    color: #ff7c4d;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 24px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 7px;
    }
  }
  .container-chapter {
    height: 174px;
    background: #ffffff;
    border-radius: 2px;
    padding: 16px;
    .chapter-name {
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .chapter-data {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      span {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 21px;
      }
    }
  }
}
.preview-right {
  padding: 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  .chapter-video {
    width: 100%;
    height: 100%;
    .video {
      width: 100%;
      height: 100%;
    }
  }
  .chapter-doc {
    width: 100%;
    height: 100%;
    .doc {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
