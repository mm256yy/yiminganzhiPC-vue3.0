<script lang="tsx">
// 用户工作平台母板
import { computed, defineComponent, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { useDesign } from '@/hooks/web/useDesign'
import { WorkMenu } from '@/components/Menu'
import { WorkUserInfo } from '@/components/UserInfo'
import { WorkLogo } from '@/components/Logo'
import UserAppView from './components/UserAppView.vue'
import { ElScrollbar } from 'element-plus'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

const pageLoading = computed(() => appStore.getPageLoading)

export default defineComponent({
  name: 'UserLayout',
  setup() {
    onMounted(() => {
      appStore.setLayout('top')
    })

    return () => (
      <section class={[prefixCls, `${prefixCls}__top`, 'w-[100%] h-[100%] relative']}>
        {/* 顶部背景 */}
        <div class="absolute z-0 bg-gradient-to-b from-[#295EE6] to-[#DFE8FF] w-full h-517px bg"></div>

        <div class="flex items-center justify-between px-16px h-64px ">
          <WorkLogo></WorkLogo>
          <WorkMenu class="flex-1 pl-24px"></WorkMenu>
          <WorkUserInfo></WorkUserInfo>
        </div>
        <div class={[`${prefixCls}-content`, 'w-full h-[calc(100%-64px)] relative z-1']}>
          <ElScrollbar v-loading={pageLoading.value} class={[`${prefixCls}-content-scrollbar`]}>
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
  max-width: 1920px;
  margin: 0 auto;
  background-color: var(--app-content-bg-color);
  :deep(.@{elNamespace}-scrollbar__view) {
    height: 100% !important;
  }
}

.bg {
  background: url(@/assets/imgs/headerbg.png) no-repeat;
  background-size: 100% 100%;
}
</style>
