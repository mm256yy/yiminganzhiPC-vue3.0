import { useAppStoreWithOut } from '@/store/modules/app'
import { PlatformType } from '@/types/platform'
import { userMenuApi } from '@/api/sys'
import { getPermissionApi } from '@/api/login'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { RouteRecordRaw } from 'vue-router'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { listDictApi } from '@/api/sys/index'

const appStore = useAppStoreWithOut()
const permissionStore = usePermissionStoreWithOut()
const dictStore = useDictStoreWithOut()

/**
 * 设置用户的工作平台，可以是管理员或普通用户。
 * 项目管理员也可以切换到普通用户的工作平台
 */
export const usePlatform = () => {
  const setPlatform = async (platform: PlatformType, addRoute: (route: RouteRecordRaw) => void) => {
    if (platform === 'admin' && !(appStore.getIsSysAdmin || appStore.getIsProjectAdmin)) {
      throw new Error('无权访问')
    }
    if (platform === 'workshop' && appStore.getIsSysAdmin) {
      throw new Error('系统管理员不能访问项目工作平台')
    }
    const user = appStore.getUserJwtInfo
    if (!user) {
      throw new Error('非登录状态')
    }

    let menus
    if (appStore.getIsSysAdmin) {
      menus = await userMenuApi(0)
    } else {
      const projectUsers = appStore.getUserInfo?.projectUsers
      if (!projectUsers || projectUsers.length === 0) {
        throw new Error('当前用户没有分配任务项目，无法登录，请联系管理员。')
      }
      if (appStore.getCurrentProjectId === 0) {
        const defaultProject = projectUsers.find((x) => x.defaultProject) || projectUsers[0]
        const projectId = defaultProject.projectId || 0
        // 设置当前项目，顶部可以支持项目切换
        appStore.setCurrentProjectId(projectId)
        // 设置项目状态
        appStore.setProjectStatus(defaultProject.status || '')
      }
      menus = await userMenuApi(appStore.getCurrentProjectId)
      const permissions = await getPermissionApi()
      appStore.setPermissions(permissions)

      if (
        projectUsers[0] &&
        projectUsers[0].roles &&
        projectUsers[0].roles.length > 0 &&
        projectUsers[0].roles[0].code == 'leaderworkbenches'
      ) {
        menus.forEach((e) => {
          console.log(e, 'bbq')
          if (e.name == 'Feedback') {
            e.meta.hidden = true
          }
        })
      }
    }

    if (!dictStore.getIsSetDict) {
      // 拿到字典
      const res = await listDictApi({
        includeVal: true,
        size: 1000
      })
      const list = res.content || []
      const dictObj: any = {}
      list.forEach((item) => {
        // 使用Id作为key 保证唯一 避免name作为key改动时影响页面
        dictObj[item.id as number] = (item.dictValList || []).map((dictItem) => {
          return {
            label: dictItem.label,
            value: dictItem.value
          }
        })
      })

      dictStore.setDictObj(dictObj)
      dictStore.setIsSetDict(true)
    }

    permissionStore.initRoutes(addRoute, menus)
    appStore.setCurrentPlatform(platform)
  }

  return {
    setPlatform
  }
}
