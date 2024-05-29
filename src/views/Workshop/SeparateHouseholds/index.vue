<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        type="default"
        class="px-9px py-0px !h-28px mr-8px !text-12px"
      >
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">基础设置</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">分户合户</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
  </WorkContentWrap>
  <div class="data-fill-head">
    <div class="head-top">
      <div class="tabs">
        <div
          style="padding: 0 20px"
          :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
          v-for="item in tabsList"
          :key="item.id"
          @click="onTabClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
  <div class="data-fill-body">
    <SeparateTable v-if="tabCurrentId === 0" />
    <MergeTable v-else-if="tabCurrentId === 1" />
    <Property v-else />
  </div>
</template>

<script setup lang="ts">
// import { reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ref, onMounted, computed } from 'vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import SeparateTable from './components/SeparateTable.vue'
import MergeTable from './components/MergeTable.vue'
import Property from './components/Property.vue'
import { useRouter } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
const appStore = useAppStore()
const userInfo = computed(() => appStore.getUserInfo)
const currentProjectId = appStore.currentProjectId
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { back } = useRouter()
const tabCurrentId = ref<number>()
const vill = ref<any>()
// 角色代码
enum RoleCodeType {
  implementation = 'implementation', // 移民实施
  assessor = 'assessor', // 房屋评估
  assessorland = 'assessorland', // 土地评估
  other = 'other', // 其他 注意不是字典 用作区别 领导角色的,
  implementleader = 'implementleader' //实施组长
}
const role = ref<RoleCodeType>(RoleCodeType.other)
/**
 * 判断角色
 */
const getRole = () => {
  if (userInfo.value) {
    const project = userInfo.value.projectUsers.find((x: any) => x.projectId === currentProjectId)
    const role =
      project && project.roles && project.roles.length
        ? (project.roles[0].code as RoleCodeType)
        : RoleCodeType.other
    // 默认用户拥有一个角色 角色选择先不考虑
    return role
  }
  return RoleCodeType.other
}
const tabsList = ref<any>([])
// const tabsList = [
//   {
//     id: 0,
//     name: '分户'
//   },
//   {
//     id: 1,
//     name: '合户'
//   },
//   {
//     id: 2,
//     name: '房屋产权分户'
//   }
// ]
const onBack = () => {
  back()
}
const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
  console.log(tabCurrentId.value, '11111')
}
onMounted(() => {
  role.value = getRole()
  role.value == 'implementation'
    ? (tabsList.value = [
        {
          id: 2,
          name: '房屋产权分户'
        }
      ])
    : (tabsList.value = [
        {
          id: 0,
          name: '分户'
        },
        {
          id: 1,
          name: '合户'
        },
        {
          id: 2,
          name: '房屋产权分户'
        }
      ])
  role.value == 'implementation' ? (tabCurrentId.value = 2) : (tabCurrentId.value = 0)
})
</script>

<style lang="less" scoped>
.data-fill-head {
  position: relative;
  padding: 14px 16px;
  margin-top: 6px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(33, 63, 98, 0.17);

  .head-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    align-items: center;

    .tab-item {
      display: flex;
      height: 32px;
      padding: 0 10px;
      margin-right: 4px;
      font-size: 14px;
      color: #000;
      cursor: pointer;
      background: #f0f2f7;
      border-radius: 10px 10px 0px 0px;
      align-items: center;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }
  }
}

.report-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .report-tab-item {
    display: flex;
    height: 32px;
    padding: 0 16px;
    margin: 14px 8px 0 0;
    font-size: 14px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    align-items: center;

    .tit {
      margin-left: 6px;
      // user-select: none;
    }

    .active-icon {
      margin-left: 6px;
    }

    &.active {
      color: var(--el-color-primary);
      background: #e9f0ff;
      border: 1px solid var(--el-color-primary);
    }
  }
}

.data-fill-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}
</style>
