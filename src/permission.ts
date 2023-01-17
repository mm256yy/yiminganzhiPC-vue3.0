import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { listDictApi } from '@/api/sys/index'

const permissionStore = usePermissionStoreWithOut()
const appStore = useAppStoreWithOut()
const dictStore = useDictStoreWithOut()

const { start, done } = useNProgress()
const { loadStart, loadDone } = usePageLoading()
const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  if (appStore.getUserJwtInfo) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }

      await permissionStore.initRoutes(router.addRoute)
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
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
      next(nextData)
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
