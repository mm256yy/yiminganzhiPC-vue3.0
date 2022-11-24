<script lang="tsx">
// 用户工作平台母板
import { computed, defineComponent, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { useDesign } from '@/hooks/web/useDesign'
import { Menu } from '@/components/Menu'
import { TagsView } from '@/components/TagsView'
import { Logo } from '@/components/Logo'
import UserAppView from './components/UserAppView.vue'
import { ElScrollbar } from 'element-plus'
import ToolHeader from './components/ToolHeader.vue'
import { useTheme } from '@/hooks/web/useTheme'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()
const { setHeaderTheme } = useTheme()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const pageLoading = computed(() => appStore.getPageLoading)

// 标签页
const tagsView = computed(() => appStore.getTagsView)

// 固定头部
const fixedHeader = computed(() => appStore.getFixedHeader)

// logo
const logo = computed(() => appStore.logo)

const handleClickOutside = () => {
  appStore.setCollapse(true)
}

export default defineComponent({
  name: 'UserLayout',
  setup() {
    onMounted(() => {
      appStore.setLayout('top')
      setHeaderTheme('#fff')
    })

    return () => (
      <section class={[prefixCls, `${prefixCls}__top`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        <div class="flex items-center justify-between bg-[var(--top-header-bg-color)] border-bottom-1 border-solid border-[var(--top-tool-border-color)] dark:border-[var(--el-border-color)]">
          {logo.value ? <Logo class="hover-trigger"></Logo> : undefined}
          <Menu class="flex-1 px-10px mr-5px h-[var(--top-tool-height)]"></Menu>
          <ToolHeader></ToolHeader>
        </div>
        <div class={[`${prefixCls}-content`, 'h-full w-full']}>
          <ElScrollbar
            v-loading={pageLoading.value}
            class={[
              `${prefixCls}-content-scrollbar`,
              {
                'mt-[var(--tags-view-height)]': fixedHeader.value
              }
            ]}
          >
            {tagsView.value ? (
              <TagsView
                class={[
                  'border-bottom-1 border-top-1 border-solid border-[var(--tags-view-border-color)] dark:border-[var(--el-border-color)]',
                  {
                    '!fixed w-full top-[var(--top-tool-height)] left-0': fixedHeader.value
                  }
                ]}
                style="transition: width var(--transition-time-02), left var(--transition-time-02);"
              ></TagsView>
            ) : undefined}

            <UserAppView></UserAppView>
          </ElScrollbar>
        </div>

        <Backtop></Backtop>

        {/* <Setting></Setting> */}
      </section>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-layout';

.@{prefix-cls} {
  background-color: var(--app-content-bg-color);
  :deep(.@{elNamespace}-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
