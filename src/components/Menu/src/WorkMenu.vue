<script lang="tsx">
import { computed, defineComponent, unref, PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItemWork'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'
import { LayoutType } from '@/types/layout'

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          class="user-menu"
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={false}
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="transparent"
          textColor="#fff"
          activeTextColor="#fff"
          onSelect={menuSelect}
          menu-trigger="click"
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(menuMode))
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => <ElScrollbar>{renderMenu()}</ElScrollbar>
  }
})
</script>

<style lang="less" scoped>
.@{elNamespace}-menu {
  margin-top: 12px;
  border-bottom: 0 none;

  .@{elNamespace}-menu-item {
    font-size: 16px;
    padding: 0;
    height: 40px;
    &:hover {
      background-color: transparent;
    }
    &.is-active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }
  .@{elNamespace}-sub-menu {
    :deep(.@{elNamespace}-sub-menu__title) {
      padding: 0 !important;
      height: 40px;
      font-size: 16px;
    }
    :deep(.@{elNamespace}-sub-menu__icon-arrow) {
      display: none;
    }

    &.is-active {
      :deep(.@{elNamespace}-sub-menu__title) {
        color: #fff;
        border-bottom: 2px solid #fff;
      }
    }
  }
}
</style>

<style lang="less">
.drop-menu {
  border-radius: 4px !important;
  .el-menu {
    .el-menu-item {
      padding: 0 36px !important;
      height: 48px !important;
      font-size: 16px !important;
      color: #131313 !important;
      &:hover {
        color: var(--el-color-primary) !important;
        background-color: transparent !important;
      }

      &.is-active {
        color: var(--el-color-primary) !important;
        border: 0 none !important;
        background-color: transparent !important;

        &:after {
          display: none !important;
        }
      }
    }
  }
}
.user-menu {
  .el-menu-item:not(.is-disabled):focus {
    background-color: transparent !important;
  }
}
</style>
