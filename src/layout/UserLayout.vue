<script lang="tsx">
// 用户工作平台母板
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { useDesign } from '@/hooks/web/useDesign'
import { WorkMenu } from '@/components/Menu'
import { WorkUserInfo } from '@/components/UserInfo'
import { WorkLogo } from '@/components/Logo'
import UserAppView from './components/UserAppView.vue'
import { ElScrollbar, ElSelect, ElOption } from 'element-plus'
import { useRouter } from 'vue-router'
import { setDefaultProjectApi } from '@/api/project'
import { ProjectRoleEnum } from '@/api/sys/types'
import { usePlatform } from '@/hooks/web/usePlatform'
import { currentUserApi } from '@/api/sys'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

const pageLoading = computed(() => appStore.getPageLoading)
const { setPlatform } = usePlatform()

const selectedProjectId = ref(0)
const projects = computed(() => {
  return appStore.getUserInfo?.projectUsers
})

export default defineComponent({
  name: 'UserLayout',
  setup() {
    const { addRoute } = useRouter()
    onMounted(async () => {
      appStore.setLayout('top')
      const userInfo = await currentUserApi()
      appStore.setUserInfo(userInfo)
      selectedProjectId.value = appStore.getCurrentProjectId
      setPlatform('workshop', addRoute)
      const project: any = projects.value?.find((x) => x.projectId === selectedProjectId.value)
      console.log(project)

      appStore.setreservoirName(project.reservoirName)
    })
    const onProjectChange = async (id: number) => {
      await setDefaultProjectApi(id)

      const project: any = projects.value?.find((x) => x.projectId === id)
      appStore.setreservoirName(project.reservoirName)

      selectedProjectId.value = id
      appStore.setUserDefaultProject(id)
      appStore.setCurrentProjectId(id)
      if (project) {
        if (project.projectRole === ProjectRoleEnum.PROJECT_ADMIN) {
          await setPlatform('admin', addRoute)
          window.location.href = '/admin.html#/dashboard/home'
        } else {
          await setPlatform('workshop', addRoute)
          window.location.href = '/#/workshop/home'
        }
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    }
    return () => (
      <section class={[prefixCls, `${prefixCls}__top`, 'w-[100%] h-[100%] relative']}>
        {/* 顶部背景 */}
        <div class="absolute z-0 bg-gradient-to-b from-[#295EE6] to-[#DFE8FF] w-full h-517px bg"></div>

        <div class="flex items-center justify-between px-16px h-64px ">
          <WorkLogo></WorkLogo>
          <WorkMenu class="flex-1 pl-24px"></WorkMenu>
          <div class="div">
            <ElSelect
              modelValue={selectedProjectId.value}
              placeholder="选择切换项目"
              onChange={onProjectChange}
            >
              {{
                default: () => {
                  return projects.value?.map((x) => (
                    <ElOption label={x.projectName} value={x.projectId || 0} />
                  ))
                }
              }}
            </ElSelect>
          </div>

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
:deep(.amap-sug-result) {
  z-index: 9999 !important;
}

.div {
  :deep(.el-input__wrapper) {
    width: 120px;
    margin-right: 50px;
    background-color: transparent;
  }

  :deep(.el-input__inner) {
    color: white;
  }
}

:deep(.el-input__inner::selection) {
  color: white;
  background-color: rgb(51, 144, 255);
}
@prefix-cls: ~'@{namespace}-layout';
.@{prefix-cls} {
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
