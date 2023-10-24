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
        <ElBreadcrumbItem class="text-size-12px">资产评估</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">
          {{ titleMsg(type, 1) }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">
          {{ titleMsg(type, 2) }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="data-fill-head">
      <UserInfo
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        :householdId="Number(householdId)"
        :type="type"
        @update-data="getLandlordInfo"
      />

      <!-- Tabs -->
      <div class="report-tabs">
        <div v-for="item in tabsType" :key="item.id">
          <div
            :class="['report-tab-item', tabCurrentId === item.id ? 'active' : '']"
            @click="onReportTabClick(item)"
          >
            <Icon :icon="item.icon" color="#3E73EC" />
            <div class="tit">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-fill-body">
      <template v-if="role === RoleCodeType.assessor">
        <!-- 房屋主体评估 -->
        <main-house
          v-show="tabCurrentId === TabIds[0]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 房屋装修评估 -->
        <house-decoration
          v-show="tabCurrentId === TabIds[1]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 房屋附属设施评估 -->
        <house-accessory
          v-show="tabCurrentId === TabIds[2]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 零星林（果）木评估 -->
        <fruit-tree
          v-show="tabCurrentId === TabIds[3]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 坟墓评估 -->
        <!-- <grave
        v-show="type == 'Landlord' && tabCurrentId === TabIds[6]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        :baseInfo="baseInfo"
        @update-data="getLandlordInfo"
      /> -->

        <!-- 企业、个体工商户 设施设备评估 -->
        <Equipment
          v-show="(type === 'Enterprise' || type === 'IndividualB') && tabCurrentId === TabIds[6]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 村集体 小型专项及农副业设施评估 -->
        <SpecialEquipment
          v-show="type === 'villageInfoC' && tabCurrentId === TabIds[6]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />
      </template>

      <template v-else>
        <!-- 土地基本情况评估 -->
        <land-basic-info
          v-show="tabCurrentId === TabIds[4]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 土地青苗及附着物评估 -->
        <land-green-seedlings
          v-show="tabCurrentId === TabIds[5]"
          :doorNo="doorNo"
          :householdId="Number(householdId)"
          :projectId="Number(projectId)"
          :uid="uid"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />
      </template>
    </div>
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { LandlordTabs, TabIds, EnterpriseTabs, IndividualBTabs, VillageInfoCTabs } from './config'
import { useAppStore } from '@/store/modules/app'
import { getLandlordByIdApi } from '@/api/putIntoEffect/putIntoEffectDataFill/service'

import { WorkContentWrap } from '@/components/ContentWrap'
import UserInfo from './components/UserInfo/Index.vue'
import MainHouse from './components/MainHouse/Index.vue' // 资产评估 -- 房屋主体评估
import HouseDecoration from './components/HouseDecoration/Index.vue' // 资产评估 -- 房屋装修评估
import HouseAccessory from './components/HouseAccessory/Index.vue' // 资产评估 -- 房屋附属设施评估
import FruitTree from './components/FruitTree/Index.vue' // 资产评估 -- 零星林（果）木评估
import LandBasicInfo from './components/LandBasicInfo/Index.vue' // 资产评估 -- 土地基本情况评估
import LandGreenSeedlings from './components/LandGreenSeedlings/Index.vue' // 资产评估 -- 土地青苗及附着物评估
// import Grave from './components/Grave/Index.vue' // 资产评估 -- 坟墓评估
import Equipment from './components/Equipment/Index.vue' // 资产评估 -- (企业/个体工商户)设施设备评估
import SpecialEquipment from './components/SpecialEquipment/Index.vue' // 资产评估 -- (村集体)小型专项及农副业设施评估

enum RoleCodeType {
  assessor = 'assessor',
  assessorland = 'reviewerland'
}

const titleMsg = (type: string, index: number) => {
  if (type == 'Landlord') {
    if (index === 1) {
      return '居民户信息'
    }
    return '居民户资产评估'
  } else if (type == 'Enterprise') {
    if (index === 1) {
      return '企业信息'
    }
    return '企业资产评估'
  } else if (type == 'IndividualB') {
    if (index === 1) {
      return '个体工商户信息'
    }
    return '个体工商户资产评估'
  } else {
    if (index === 1) {
      return '村集体信息'
    }
    return '村集体资产评估'
  }
}

const { currentRoute, back } = useRouter()
const baseInfo = ref<any>({})
const tabsType = ref<any>([])
const tabCurrentId = ref<number>(TabIds[0])
const { doorNo, householdId, type, projectId, uid } = currentRoute.value.query as any
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const appStore = useAppStore()
const userInfo = computed(() => appStore.getUserInfo)
const currentProjectId = appStore.currentProjectId
const role = ref<RoleCodeType>(RoleCodeType.assessor) // 角色代码 assessor 房屋评估的 assessorland 土地评估的

/**
 * 判断角色
 */
const getRole = () => {
  if (userInfo.value) {
    const project = userInfo.value.projectUsers.find((x: any) => x.projectId === currentProjectId)
    const role =
      project && project.roles && project.roles.length
        ? (project.roles[0].code as RoleCodeType)
        : RoleCodeType.assessor
    // 默认用户拥有一个角色 角色选择先不考虑
    return role
  }
  return RoleCodeType.assessor
}

// 农户详情
const getLandlordInfo = () => {
  if (!householdId) return
  getLandlordByIdApi(householdId).then((res) => {
    baseInfo.value = { ...res }
  })
}

getLandlordInfo()

const onReportTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}

onMounted(() => {
  role.value = getRole()
  if (type === 'Landlord') {
    tabsType.value = LandlordTabs
  } else if (type === 'Enterprise') {
    tabsType.value = EnterpriseTabs
  } else if (type === 'IndividualB') {
    tabsType.value = IndividualBTabs
  } else if (type === 'VillageInfoC') {
    tabsType.value = VillageInfoCTabs
  }
})

const onBack = () => {
  back()
}
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
      padding: 0 21px;
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

.report-dialog {
  .report-cont {
    padding: 22px 55px;
    margin: 0 auto;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .report-item {
      display: flex;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      align-items: center;

      .report-tit {
        margin-right: 16px;
        color: rgba(19, 19, 19, 0.6);
        text-align: right;
      }

      .report-txt {
        font-weight: 500;
        color: var(--text-color-1);
      }
    }
  }

  .tips {
    display: flex;
    align-items: center;
    margin-top: 16px;
    font-size: 14px;
    color: var(--text-color-1);
  }
}
</style>

<style lang="less">
.el-divider--horizontal {
  margin: 8px 0 24px;
}

.report-dialog {
  .el-dialog__body {
    padding: 16px 40px !important;
  }
}

.datafill-content {
  padding: 12px 16px 16px;
  background: #ffffff;
  border-radius: 4px;
}
</style>
