import type { RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
import { computed } from 'vue'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const appStore = useAppStore()
    const layout = computed(() => appStore.getLayout)
    const { t } = useI18n()
    const { title = 'Please set title', icon } = meta

    // 用户平台不需要icon
    return icon && layout.value !== 'top' ? (
      <>
        <Icon icon={meta.icon}></Icon>
        <span class="v-menu__title">{t(title as string)}</span>
      </>
    ) : (
      <span class="v-menu__title">{t(title as string)}</span>
    )
  }

  return {
    renderMenuTitle
  }
}
