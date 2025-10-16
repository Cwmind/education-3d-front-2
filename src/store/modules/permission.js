import auth from '@/plugins/auth'
import router, { dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import { cloneDeep } from 'lodash'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    topbarRouters: []
  }),
  actions: {
    setTopbarRoutes(routes) {
      this.topbarRouters = routes
    },
    generateRoutes(roles) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        // getRouters().then(res => {
        const data = []
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
        const topbarRouters = getTopbarRoutes(asyncRoutes)
        asyncRoutes.forEach((route) => {
          router.addRoute(route)
        })
        this.setTopbarRoutes(topbarRouters)
        resolve(data)
        // })
      })
    }
  }
})

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach((route) => {
    if (route && route.children?.length > 0) {
      route.children = filterDynamicRoutes(route.children)
      if (route.children.length > 0) {
        res.push(route)
      }
    } else {
      if (route.roles && auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}
export function getTopbarRoutes(routes) {
  const cloneRoutes = cloneDeep(routes)
  const res = []
  cloneRoutes.forEach((route) => {
    if (route.redirect && route.children?.length === 1) {
      delete route.children
      res.push(route)
    } else {
      res.push(route)
    }
  })
  return res
}

export default usePermissionStore
