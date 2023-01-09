import type { RouteMeta } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { t } = useI18n()
    const { title = 'Please set title' } = meta

    // 用户平台不需要icon
    return <span class="v-menu__title">{t(title as string)}</span>
  }

  return {
    renderMenuTitle
  }
}
