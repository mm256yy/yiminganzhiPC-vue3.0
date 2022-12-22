import { ElSubMenu, ElMenuItem } from 'element-plus'
import type { RouteMeta } from 'vue-router'
import { hasOneShowingChild } from '../helper'
import { isUrl } from '@/utils/is'
import { useRenderMenuTitle } from './useRenderMenuTitle'
import { useRenderDropMenuTitle } from './useRenderDropMenuTitle'
import { useDesign } from '@/hooks/web/useDesign'
import { pathResolve } from '@/utils/routerHelper'

export const useRenderMenuItem = (menuMode: 'vertical' | 'horizontal') => {
  const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/', sub?: boolean) => {
    return routers.map((v) => {
      const meta = (v.meta ?? {}) as RouteMeta
      if (!meta.hidden) {
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
        const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path) // getAllParentPath<AppRouteRecordRaw>(allRouters, v.path).join('/')

        const { renderMenuTitle } = useRenderMenuTitle()
        const { renderDropMenuTitle } = useRenderDropMenuTitle()

        if (
          oneShowingChild &&
          (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
          !meta?.alwaysShow
        ) {
          return sub ? (
            <ElMenuItem index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}>
              {{
                default: () => renderDropMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta)
              }}
            </ElMenuItem>
          ) : (
            <div class="flex w-104px items-center justify-center overflow-hidden">
              <ElMenuItem
                index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}
              >
                {{
                  default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta)
                }}
              </ElMenuItem>
            </div>
          )
        } else {
          const { getPrefixCls } = useDesign()

          const preFixCls = getPrefixCls('menu-popper')
          return (
            <div class="flex w-104px items-center justify-center overflow-hidden">
              <ElSubMenu
                index={fullPath}
                popperClass={
                  menuMode === 'vertical'
                    ? `${preFixCls}--vertical drop-menu`
                    : `${preFixCls}--horizontal drop-menu`
                }
              >
                {{
                  title: () => renderMenuTitle(meta),
                  default: () => renderMenuItem(v.children!, fullPath, true)
                }}
              </ElSubMenu>
            </div>
          )
        }
      }
    })
  }

  return {
    renderMenuItem
  }
}
