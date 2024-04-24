<template>
  <!-- 实物调查首页 -->
  <InvestigationHome v-if="role === RoleCodeType.investigator || role === RoleCodeType.reviewer" />
  <!-- 领导首页 -->
  <LeaderHome
    v-else-if="
      role === (RoleCodeType.leaderworkbenches || role === RoleCodeType.supervision) && !esey
    "
  />
  <Eseyhost v-else-if="esey" />
  <!--评估人员首页-->
  <EvaluationHome v-else-if="isEvaluation" />
  <!-- 实施人员首页 -->
  <UserHome
    v-else-if="role === RoleCodeType.implementation || role === RoleCodeType.implementleader"
  />
  <!--档案管理人员首页-->
  <FileMngHome v-else-if="role === RoleCodeType.fileadmin" />
  <!-- 其他首页 -->
  <OtherHome v-else />
  <div
    style="position: fixed; top: 20px; right: 112px"
    v-if="role === RoleCodeType.leaderworkbenches || role === RoleCodeType.supervision"
  >
    <div style="padding: 0 10px; color: #fff; border: 1px solid #ffffff" @click="handelesey"
      >版本切换</div
    >
  </div>
</template>

<script lang="ts" setup>
/**
 * 首页入口页面
 * 根据角色判断
 * 展示不同的页面
 * 只放页面组件
 */

import { computed, onBeforeMount, ref } from 'vue'
import UserHome from './AdminHome.vue'
import LeaderHome from '../ExternalLink/LeaderSide.vue'
import EvaluationHome from './EvaluationHome.vue'
import InvestigationHome from './Index.vue'
import FileMngHome from '@/views/Workshop/FileMng/NewFileSeries/Index.vue'
import OtherHome from './Other.vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import Eseyhost from './Easeyhost.vue'
const permissionStore = usePermissionStore()
// 角色代码
enum RoleCodeType {
  investigator = 'investigator', // 实物调查
  reviewer = 'reviewer', // 实物复核
  implementation = 'implementation', // 移民实施
  leaderworkbenches = 'leaderworkbenches', // 读的字典366配置的 为领导工作台
  assessor = 'assessor', // 房屋评估
  assessorland = 'assessorland', // 土地评估
  other = 'other', // 其他 注意不是字典 用作区别 领导角色的,
  implementleader = 'implementleader', //实施组长
  legalentity = 'legalentity',
  relocationagent = 'relocationagent',
  relocationchief = 'relocationchief',
  supervision = 'supervision',
  responsibilities = 'responsibilities',
  finance = 'finance',
  executive = 'executive',
  financevoucher = 'financevoucher',
  township = 'township',
  fileadmin = 'fileadmin' // 档案管理员
}
let esey = ref(false)
let handelesey = () => {
  esey.value = !esey.value
}
const appStore = useAppStore()
const userInfo = computed(() => appStore.getUserInfo)
const currentProjectId = appStore.currentProjectId
// 默认展示普通用户首页
const role = ref<RoleCodeType>(RoleCodeType.other) // 角色代码 other为普通首页

const isEvaluation = computed(() => {
  return role.value == RoleCodeType.assessor
})

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
let rolerToRouter = ref([
  { name: 'legalentity', path: 'FundAllocation' },
  { name: 'relocationagent', path: 'PaymentApplication' },
  { name: 'relocationchief', path: 'PaymentReview' },
  { name: 'responsibilities', path: 'PaymentReview' },
  { name: 'finance', path: 'PaymentReview' },
  { name: 'executive', path: 'PaymentReview' },
  { name: 'financevoucher', path: 'PaymentReview' },
  { name: 'township', path: 'TownshipFundEntry' },
  { name: 'assessorland', path: 'LandAssociation' }
])
const Router = useRouter()
onBeforeMount(() => {
  role.value = getRole()
  console.log(Router.currentRoute.value.query.row)

  console.log(Router.options.history.state.back, role.value, permissionStore.getIsAddRouters, 'bbq')

  // if (
  //   permissionStore.getIsAddRouters &&
  //   role.value == 'legalentity' &&
  //   Router.options.history.state.back == '/login'
  // ) {
  //   Router.push({ name: 'FundAllocation' })
  // }
  rolerToRouter.value.forEach((item) => {
    if (
      permissionStore.getIsAddRouters &&
      role.value == item.name &&
      Router.currentRoute.value.query.row
    ) {
      Router.push({ name: item.path })
    }
  })
})
// onMounted(() => {
//   console.log(role.value, permissionStore.getIsAddRouters, 'bbq')
//   if (permissionStore.getIsAddRouters && role.value == 'legalentity') {
//     push('FundAllocation')
//   }
// })
</script>
