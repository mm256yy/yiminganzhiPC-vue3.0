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
        <ElBreadcrumbItem class="text-size-12px">移民实施</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">
          {{ titleMsg(type) }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">数据填报</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="data-fill-head">
      <div class="head-top">
        <div class="tabs">
          <div
            :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
            v-for="item in FlowTabs"
            :key="item.id"
            @click="onTabClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>

      <UserInfo
        :baseInfo="baseInfo"
        :householdId="Number(householdId)"
        :type="type"
        :tabCurrentId="tabCurrentId"
        @update-data="getLandlordInfo"
      />

      <!-- Tabs -->
      <div class="report-tabs">
        <div v-for="item in tabsType" :key="item.id">
          <div
            v-if="item.type == tabCurrentId"
            :class="['report-tab-item', reportTabCurrentId === item.id ? 'active' : '']"
            @click="onReportTabClick(item)"
          >
            <Icon :icon="item.icon" color="#3E73EC" />
            <div class="tit">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-fill-body" v-if="type == 'Landlord'">
      <!-- 方案比选 -- 方案比选 -->
      <scheme-base :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId == 6" />
      <!-- 房屋腾空 -->
      <HouseEmpty
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 7 && reportTabCurrentId === ReportTabIds[0]"
      />

      <!-- 土地腾空过渡 -->
      <LandEmpty
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 7 && reportTabCurrentId === ReportTabIds[1]"
      />

      <!-- 过渡安置 -->
      <TransitionResettle
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 7 && reportTabCurrentId === ReportTabIds[2]"
      />
      <!-- 生产安置 农业安置 -->
      <FarmingResettle
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 8 && reportTabCurrentId === ReportTabIds[0]"
      />
      <!-- 生产安置 养老保险 -->
      <InsureResettle
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 8 && reportTabCurrentId === ReportTabIds[1]"
      />
      <!-- 生产安置 自谋职业 -->
      <SelfResettle
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 8 && reportTabCurrentId === ReportTabIds[2]"
      />

      <!-- 资产评估 -- 房屋主体评估 -->
      <main-house
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[0]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />

      <!-- 资产评估 -- 房屋装修评估 -->
      <house-decoration
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[1]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />

      <!-- 资产评估 -- 房屋附属设施评估 -->
      <house-accessory
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[2]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />

      <!-- 资产评估 -- 零星林（果）木评估 -->
      <fruit-tree
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[3]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />

      <!-- 资产评估 -- 土地基本情况评估 -->
      <land-basic-info
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[4]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />
      <!-- 资产评估 -- 土地青苗及附着物评估 -->
      <land-green-seedlings
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[5]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />

      <!-- 资产评估 -- 坟墓评估 -->
      <grave
        v-show="tabCurrentId == 0 && reportTabCurrentId === ReportTabIds[6]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        @update-data="getLandlordInfo"
      />

      <!-- 资格认定 -- 人口核定 -->
      <populationCheck
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @refresh="getLandlordInfo"
        v-if="reportTabCurrentId === ReportTabIds[0] && tabCurrentId == 1"
      />

      <!-- 资格认定 -- 房屋确权 -->
      <houseConfirmation
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[1] && tabCurrentId == 1"
      />

      <!-- 安置确认 -- 搬迁安置 -->
      <relocation
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-else-if="reportTabCurrentId === ReportTabIds[0] && tabCurrentId == 2"
      />

      <!-- 安置确认 -- 生产安置 -->
      <produce
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @refresh="getLandlordInfo"
        v-else-if="reportTabCurrentId === ReportTabIds[1] && tabCurrentId == 2"
      />

      <!-- 安置确认 -- 坟墓安置 -->
      <gaveArrange
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-else-if="reportTabCurrentId === ReportTabIds[2] && tabCurrentId == 2"
      />

      <!-- 移民建卡 -->
      <createCard :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId == 4" />

      <Agreement :doorNo="doorNo" v-if="tabCurrentId == 3" />

      <!-- 动迁安置 -- 房屋腾空确认单 -->
      <house-soar
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[0]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 青苗腾空确认单 -->
      <green-seedlings-soar
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[1]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 择房确认单 -->
      <choose-house
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[2]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 择址确认单 -->
      <site-selection
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[3]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 建房告知单 -->
      <build-house
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[4]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 择房交付告知单 -->
      <optional-delivery
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[5]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 坟墓择址确认单 -->
      <tomb-address
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[6]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 坟墓迁移告知单 -->
      <tomb-migrations
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[7]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 生产用地 -->
      <production-land
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[8]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 社保缴费 -->
      <social-security
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[9]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 自建房 -->
      <build-room
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[10]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 安置进度 -->
      <placement-progress
        v-if="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[11]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        :status="baseInfo.status"
      />
    </div>
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ReportTabs,
  FlowTabs,
  ReportTabIds,
  EnterpriseTabs,
  IndividualBTabs,
  villageInfoCTabs
} from './config'

import { getLandlordByIdApi } from '@/api/putIntoEffect/putIntoEffectDataFill/service'

import MainHouse from './AssetEvaluation/MainHouse/Index.vue' // 资产评估 -- 房屋主体评估
import HouseDecoration from './AssetEvaluation/HouseDecoration/Index.vue' // 资产评估 -- 房屋装修评估
import HouseAccessory from './AssetEvaluation/HouseAccessory/Index.vue' // 资产评估 -- 房屋附属设施评估
import FruitTree from './AssetEvaluation/FruitTree/Index.vue' // 资产评估 -- 零星林（果）木评估
import LandBasicInfo from './AssetEvaluation/LandBasicInfo/Index.vue' // 资产评估 -- 土地基本情况评估
import LandGreenSeedlings from './AssetEvaluation/LandGreenSeedlings/Index.vue' // 资产评估 -- 土地青苗及附着物评估
import Grave from './AssetEvaluation/Grave/Index.vue' // 资产评估 -- 坟墓评估

import populationCheck from './populationCheck/Index.vue' // 资格认定 -- 人口核定
import houseConfirmation from './houseConfirmation/Index.vue' // 资格认证 -- 房屋确权

import relocation from './relocation/Index.vue' // 安置确认 -- 搬迁安置
import produce from './produce/Index.vue' // 安置确认 -- 生产安置
import gaveArrange from './gaveArrange/Index.vue' // 安置确认 -- 坟墓安置
import SchemeBase from './SchemeBase/Index.vue' // 方案对比 -- 方案对比
// import AgreeInfo from './AgreeInfo/Index.vue' // 方案对比 -- 填写协议信息

import createCard from './createCard/Index.vue' // 移民建卡

import Agreement from './Agreement/Agreement.vue' // 协议签订

import HouseSoar from './RelocationResettle/HouseSoar/Index.vue' // 动迁安置 -- 房屋腾空确认单
import GreenSeedlingsSoar from './RelocationResettle/GreenSeedlingsSoar/Index.vue' // 动迁安置 -- 青苗腾空确认单
import ChooseHouse from './RelocationResettle/ChooseHouse/Index.vue' // 动迁安置 -- 择房确认单
import SiteSelection from './RelocationResettle/SiteSelection/Index.vue' // 动迁安置 -- 择址确认单
import BuildHouse from './RelocationResettle/BuildHouse/Index.vue' // 动迁安置 -- 建房告知单
import OptionalDelivery from './RelocationResettle/OptionalDelivery/Index.vue' // 动迁安置 -- 择房交付告知单
import TombAddress from './RelocationResettle/TombAddress/Index.vue' // 动迁安置 -- 坟墓择址确认单
import TombMigrations from './RelocationResettle/TombMigrations/Index.vue' // 动迁安置 -- 坟墓迁移告知单

import ProductionLand from './RelocationResettle/ProductionLand/Index.vue' // 动迁安置 -- 生产用地
import SocialSecurity from './RelocationResettle/SocialSecurity/Index.vue' // 动迁安置 -- 社保缴费
import BuildRoom from './RelocationResettle/BuildRoom/Index.vue' // 动迁安置 -- 自建房
import PlacementProgress from './RelocationResettle/PlacementProgress/Index.vue' // 动迁安置 -- 安置进度

import HouseEmpty from './Empty/house.vue'
import LandEmpty from './Empty/land.vue'
import TransitionResettle from './Empty/transition.vue'

import FarmingResettle from './ProductionResettle/farming.vue'
import InsureResettle from './ProductionResettle/insure.vue'
import SelfResettle from './ProductionResettle/findSelf.vue'

import UserInfo from './components/UserInfo.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const titleStatus = router.currentRoute.value?.meta?.title?.split('-')[1]
  ? router.currentRoute.value?.meta?.title?.split('-')[1]
  : '采集'
const titleMsg = (type: string) => {
  if (type == 'Landlord') {
    return '居民户信息' + titleStatus
  } else if (type == 'Enterprise') {
    return '企业信息' + titleStatus
  } else if (type == 'IndividualB') {
    return '个体工商信息' + titleStatus
  } else {
    return '村集体信息' + titleStatus
  }
}
const { currentRoute, back } = useRouter()
const baseInfo = ref<any>({})
const tabsType = ref<any>([])
const tabCurrentId = ref<number>(0)
const reportTabCurrentId = ref<number>(ReportTabIds[0])
const { doorNo, householdId, type, projectId, uid } = currentRoute.value.query as any
const BackIcon = useIcon({ icon: 'iconoir:undo' })

// 农户详情
const getLandlordInfo = () => {
  if (!householdId) return
  getLandlordByIdApi(householdId).then((res) => {
    baseInfo.value = res
  })
}

getLandlordInfo()

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
  reportTabCurrentId.value = 1
}

const onReportTabClick = (tabItem) => {
  if (reportTabCurrentId.value === tabItem.id) {
    return
  }
  reportTabCurrentId.value = tabItem.id
}

onMounted(() => {
  if (type == 'Landlord') {
    tabsType.value = ReportTabs
  } else if (type == 'Enterprise') {
    tabsType.value = EnterpriseTabs
  } else if (type == 'IndividualB') {
    tabsType.value = IndividualBTabs
  } else if (type == 'villageInfoC') {
    tabsType.value = villageInfoCTabs
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
