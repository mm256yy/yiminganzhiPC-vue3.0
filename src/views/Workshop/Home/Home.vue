<template>
  <!-- 领导首页 -->
  <LeaderHome v-if="role == RoleCodeType.leaderworkbenches" />
  <!-- 普通用户首页 -->
  <UserHome v-else />
</template>

<script lang="ts" setup>
/**
 * 首页入口页面
 * 根据角色判断
 * 展示不同的页面
 * 只放页面组件
 */

import { computed, onBeforeMount, ref } from 'vue'
import UserHome from './AdminHome.vue' // 实施人员首页
import LeaderHome from './EvaluationHome.vue' // 评估人员首页
import { useAppStore } from '@/store/modules/app'

// 角色代码
enum RoleCodeType {
  leaderworkbenches = 'leaderworkbenches', // 读的字典366配置的 为领导工作台
  other = 'other' // 其他 注意不是字典 用作区别 领导角色的
}

const appStore = useAppStore()
const userInfo = computed(() => appStore.getUserInfo)
const currentProjectId = appStore.currentProjectId
// 默认展示普通用户首页
const role = ref<RoleCodeType>(RoleCodeType.other) // 角色代码 other为普通首页

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

onBeforeMount(() => {
  role.value = getRole()
})
</script>
