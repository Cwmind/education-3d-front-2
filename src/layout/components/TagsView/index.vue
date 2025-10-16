<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <close class="el-icon-close" style="vertical-align: middle" />
        </span>
      </router-link>
    </scroll-pane>
  </div>
</template>

<script setup>
import ScrollPane from './ScrollPane'
import { getNormalPath } from '@/utils/ruoyi'
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const affixTags = ref([])
const scrollPaneRef = ref(null)

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const visitedViews = computed(() => useTagsViewStore().visitedViews)
const routes = computed(() => usePermissionStore().routes)

watch(route, () => {
  addTags()
  moveToCurrentTag()
})

onMounted(() => {
  initTags()
  addTags()
})

const computedStyle = computed(() => {
  if (route.path === '/adminIndex') {
    return 'adminIndex'
  } else {
    return ''
  }
})

function isActive(r) {
  return r.path === route.path
}
function activeStyle(tag) {
  if (!isActive(tag)) return {}
  return {
    'background-color': '#FF7C4D',
    'border-color': '#FF7C4D'
  }
}

function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function filterAffixTags(routes, basePath = '') {
  let tags = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
function initTags() {
  const res = filterAffixTags(routes.value)
  affixTags.value = res
  for (const tag of res) {
    // Must have tag name
    if (tag.name) {
      useTagsViewStore().addVisitedView(tag)
    }
  }
}
function addTags() {
  const { name } = route
  if (name) {
    useTagsViewStore().addView(route)
    if (route.meta.link) {
      useTagsViewStore().addIframeView(route)
    }
  }
  return false
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r)
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route)
        }
      }
    }
  })
}
function closeSelectedTag(view) {
  proxy.$tab.closePage(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/variables.module';

.tags-view-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: $tag-bar-height;
  background: #e9e9e9;

  .tags-view-wrapper {
    .tags-view-item {
      position: relative;
      display: inline-block;
      height: 28px;
      padding: 0 8px;
      margin-top: 8px;
      margin-left: 8px;
      font-size: 12px;
      line-height: 28px;
      color: #000000;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 4px;
      border: 1px solid #f8f8f8;
      backdrop-filter: blur(2px);
      font-weight: 500;
      cursor: pointer;
      &:first-of-type {
        margin-left: 16px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        color: #fff;
        padding: 0 8px;
        &::before {
          position: relative;
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 2px;
          margin-bottom: 1px;
          background: #ffffff;
          border-radius: 50%;
          content: '';
        }
      }
    }
  }

  .contextmenu {
    position: absolute;
    z-index: 3000;
    padding: 5px 0;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    list-style-type: none;
    background: #fff;
    border-radius: 4px;
    box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);

    li {
      padding: 7px 16px;
      margin: 0;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
.adminIndex {
  background: #050709;
  ::-webkit-scrollbar-track {
    background-color: #d30505;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #0ea094;
    border-radius: 3px;
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 14px;
      height: 14px;
      margin-bottom: 2px;
    }
  }
}
</style>
