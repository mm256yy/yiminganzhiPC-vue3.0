import { defineStore } from 'pinia'
import { baseConstantRouterMap, adminConstantRouterMap, workshopConstantRouterMap } from '@/router'
import { generateRoutesFn2, flatMultiLevelRoutes } from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { useCache } from '@/hooks/web/useCache'
import { RouteRecordRaw } from 'vue-router'
import { useAppStoreWithOut } from './app'
import { ProjectRoleEnum } from '@/api/sys/types'

const { wsCache } = useCache()
const appStore = useAppStoreWithOut()
export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(routers?: AppCustomRouteRecordRaw[] | string[]): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap =
          appStore.getIsSysAdmin ||
          appStore.getCurrentProject?.projectRole === ProjectRoleEnum.PROJECT_ADMIN
            ? adminConstantRouterMap
            : workshopConstantRouterMap
        routerMap = routerMap.concat(generateRoutesFn2(routers as AppCustomRouteRecordRaw[]))
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由

        this.routers = cloneDeep(baseConstantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
    async initRoutes(addRoute: (route: RouteRecordRaw) => void, menus?: any) {
      const cacheName =
        appStore.getIsSysAdmin ||
        appStore.getCurrentProject?.projectRole === ProjectRoleEnum.PROJECT_ADMIN
          ? 'adminRouters'
          : 'workshopRouters'
      const routers = menus || wsCache.get(cacheName)
      wsCache.set(cacheName, routers)
      await this.generateRoutes(routers)
      this.getAddRouters.forEach((route) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
      })
      this.setIsAddRouters(true)
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
