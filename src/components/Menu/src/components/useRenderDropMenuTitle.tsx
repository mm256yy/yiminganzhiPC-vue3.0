import type { RouteMeta } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'

export const useRenderDropMenuTitle = () => {
  const renderDropMenuTitle = (meta: RouteMeta) => {
    const { t } = useI18n()
    const { title = 'Please set title' } = meta

    return (
      <div class="flex items-center h-48px">
        <span
          class="w-8px h-8px rounded-[50%]"
          style={{
            background: 'linear-gradient(102deg, #3E73EC 0%, #FFFFFF 100%)'
          }}
        ></span>
        <span class="v-menu__title ml-25px">{t(title as string)}</span>
      </div>
    )
  }

  return {
    renderDropMenuTitle
  }
}
