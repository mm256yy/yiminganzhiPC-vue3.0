<script lang="tsx">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { Collapse } from '@/components/Collapse'
import { UserInfo } from '@/components/UserInfo'
import { Screenfull } from '@/components/Screenfull'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ElSelect, ElOption } from 'element-plus'
import { setDefaultProjectApi } from '@/api/project'
import { ProjectRoleEnum } from '@/api/sys/types'
import { usePlatform } from '@/hooks/web/usePlatform'
import { useRouter } from 'vue-router'

const { getPrefixCls, variables } = useDesign()
const prefixCls = getPrefixCls('tool-header')
const appStore = useAppStore()
const { setPlatform } = usePlatform()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)
// 折叠图标
const hamburger = computed(() => appStore.getHamburger)
// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)
// 布局
const layout = computed(() => appStore.getLayout)
// 是否显示项目切换列表
const showProjectList = computed(() => {
  if (appStore.getIsSysAdmin) {
    return false
  }
  return appStore.getUserInfo?.projectUsers && appStore.getUserInfo?.projectUsers.length > 1
})
// 当前用户有权限的所有项目
const projects = computed(() => {
  return appStore.getUserInfo?.projectUsers
})

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    const selectedProjectId = ref(0)
    const { addRoute } = useRouter()

    onMounted(() => {
      selectedProjectId.value = appStore.getCurrentProjectId
    })

    const onProjectChange = async (id: number) => {
      await setDefaultProjectApi(id)
      const project = projects.value?.find((x) => x.projectId === id)
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
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="hover-trigger" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          {showProjectList.value ? (
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
          ) : undefined}
          {screenfull.value ? (
            <Screenfull class="hover-trigger" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {/* <ThemeSwitch /> */}
          <UserInfo class="hover-trigger"></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tool-header';

.@{prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
