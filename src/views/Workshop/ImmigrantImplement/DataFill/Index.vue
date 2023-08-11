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
          {{ titleMsg(type, 1) }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">
          {{ titleMsg(type, 2) }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="data-fill-head">
      <div class="head-top">
        <div class="tabs">
          <div
            :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
            v-for="item in tabsList"
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
        <div v-for="item in subTabsList" :key="item.id">
          <div
            v-if="item.type == tabCurrentId"
            :class="['report-tab-item', subTabCurrentId === item.id ? 'active' : '']"
            @click="onSubTabClick(item)"
          >
            <Icon :icon="item.icon" color="#3E73EC" />
            <div class="tit">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 居民户 -->
    <div class="data-fill-body" v-if="type == 'PeasantHousehold'">
      <!-- 居民户信息 -->
      <household-info :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId == 0" />

      <!-- 资格认定 -->
      <template v-if="tabCurrentId == 1">
        <!-- 人口核定 -->
        <population-check
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @refresh="getLandlordInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 房屋产权 -->
        <house-property
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          :householdId="householdId"
          v-if="subTabCurrentId === TabIds[1]"
        />
      </template>

      <!-- 资产评估 -->
      <template v-if="tabCurrentId == 2">
        <!-- 房屋附属物评估报告 -->
        <house-accessory-eva-report
          v-show="subTabCurrentId === TabIds[0]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 土地附着物评估报告 -->
        <land-accessory-eva-report
          v-show="subTabCurrentId === TabIds[1]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />
      </template>

      <!-- 模拟安置 -->
      <scheme-base :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId == 3" />

      <!-- 安置确认 -->
      <template v-if="tabCurrentId == 4">
        <!-- 搬迁安置 -->
        <relocation-arrange
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 生产安置 -->
        <produce-arrange
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @refresh="getLandlordInfo"
          v-if="subTabCurrentId === TabIds[1]"
        />

        <!-- 坟墓安置 -->
        <grave-arrange :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[2]" />
      </template>

      <!-- 择址确认 -->
      <template v-if="tabCurrentId === 5">
        <!-- 生产用地 -->
        <prod-land
          v-if="subTabCurrentId === TabIds[0]"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 择房择址 -->
        <site-sel
          v-if="subTabCurrentId === TabIds[1]"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 坟墓择址 -->
        <tomb-site-sel
          v-if="subTabCurrentId === TabIds[2]"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />
      </template>

      <!-- 居民户 -- 协议签订 -->
      <household-agreement-sign :doorNo="doorNo" v-if="tabCurrentId === 6" />

      <!-- 居民户 -- 移民建卡 -->
      <create-card :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId === 7" />

      <!-- 腾空过渡 -->
      <template v-if="tabCurrentId == 8">
        <!-- 房屋腾空 -->
        <house-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[0]" />

        <!-- 土地腾让 -->
        <land-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[1]" />

        <!-- 过渡安置 -->
        <transition-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[2]"
        />
      </template>

      <!-- 搬迁安置 -->
      <template v-if="tabCurrentId == 9">
        <!-- 自建房 -->
        <SelfBuildHouse
          v-if="baseInfo.houseAreaType === 'homestead'"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
        />

        <!-- 公寓房 -->
        <Apartment
          v-if="baseInfo.houseAreaType === 'flat'"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 集中供养 -->
        <CentralizedSupport
          v-if="baseInfo.houseAreaType === 'concentrate'"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
        />
      </template>

      <!-- 生产安置 -->
      <template v-if="tabCurrentId === 10">
        <!-- 农业安置 -->
        <farming-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 养老保险 -->
        <insure-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[1]"
        />

        <!-- 自谋职业 -->
        <self-resettle :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[2]" />
      </template>

      <!-- 相关手续 -->
      <Procedures :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId == 11" />
    </div>

    <!-- 企业 -->
    <div class="data-fill-body" v-if="type == 'Enterprise'">
      <!-- 资产评估 -->
      <template v-if="tabCurrentId == 0">
        <!-- 房屋附属物评估报告 -->
        <house-accessory-eva-report
          v-if="subTabCurrentId === TabIds[0]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 土地附着物评估报告 -->
        <land-accessory-eva-report
          v-if="subTabCurrentId === TabIds[1]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 设施设备评估报告 -->
        <equipment-eva-report v-if="subTabCurrentId == TabIds[2]" />
      </template>

      <!-- 企业建卡 -->
      <ent-card-establishment v-if="tabCurrentId == 1" />

      <!-- 腾空 -->
      <template v-if="tabCurrentId == 2">
        <!-- 房屋腾空 -->
        <house-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[0]" />

        <!-- 土地腾让 -->
        <land-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[1]" />
      </template>

      <!-- 动迁协议 -->
      <ent-relocation-agreement v-if="tabCurrentId == 3" />

      <!-- 相关手续 -->
      <ent-procedures v-if="tabCurrentId == 4" />
    </div>

    <!-- 个体工商户 -->
    <div class="data-fill-body" v-if="type == 'IndividualB'">
      <!-- 资产评估 -->
      <template v-if="tabCurrentId == 0">
        <!-- 房屋附属物评估报告 -->
        <house-accessory-eva-report
          v-if="subTabCurrentId === TabIds[0]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 土地附着物评估报告 -->
        <land-accessory-eva-report
          v-if="subTabCurrentId === TabIds[1]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 设施设备评估报告 -->
        <equipment-eva-report v-if="subTabCurrentId == TabIds[2]" />
      </template>

      <!-- 个体户建卡 -->
      <individual-card-establishment v-if="tabCurrentId == 1" />

      <!-- 腾空 -->
      <template v-if="tabCurrentId == 2">
        <!-- 房屋腾空 -->
        <house-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[0]" />

        <!-- 土地腾让 -->
        <land-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="subTabCurrentId === TabIds[1]" />
      </template>

      <!-- 动迁协议 -->
      <individual-relocation-agreement v-if="tabCurrentId == 3" />

      <!-- 相关手续 -->
      <individual-procedures v-if="tabCurrentId == 4" />
    </div>

    <!-- 村集体 -->
    <div class="data-fill-body" v-if="type == 'village'">
      <!-- 资产评估 -->
      <template v-if="tabCurrentId == 0">
        <!-- 房屋附属物评估报告 -->
        <house-accessory-eva-report
          v-if="subTabCurrentId === TabIds[0]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 土地附着物评估报告 -->
        <land-accessory-eva-report
          v-if="subTabCurrentId === TabIds[1]"
          :doorNo="doorNo"
          @update-data="getLandlordInfo"
        />

        <!-- 农村小型专项设施评估报告 -->
        <special-equipment-eva-report v-if="subTabCurrentId == TabIds[2]" />
      </template>

      <!-- 腾空(村集体只有房屋腾空) -->
      <house-vacate :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId === 1" />

      <!-- 协议签订 -->
      <template v-if="tabCurrentId == 2">
        <!-- 动迁安置协议 -->
        <village-relocation-agreement v-if="subTabCurrentId == TabIds[0]" />

        <!-- 过渡安置协议 -->
        <village-transition-agreement v-if="subTabCurrentId == TabIds[1]" />
      </template>

      <!-- 集体资产处置方法 -->
      <collective-asset-disposal v-if="tabCurrentId == 3" />
    </div>
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import {
  TabIds,
  HouseholdTabs,
  EnterpriseTabs,
  IndividualTabs,
  VillageTabs,
  HouseholdSubTabs,
  EnterpriseSubTabs,
  IndividualSubTabs,
  VillageSubTabs
} from './config'

import { getLandlordByIdApi } from '@/api/putIntoEffect/putIntoEffectDataFill/service'

import HouseholdInfo from './HouseholdInfo/Index.vue' // 居民户信息

import PopulationCheck from './PopulationCheck/Index.vue' // 资格认定 -- 人口核定
import HouseProperty from './HouseProperty/Index.vue' // 资格认定 -- 房屋产权

import HouseAccessoryEvaReport from './AssetEvaluation/HouseAccessoryEvaReport.vue' // 资产评估 -- 房屋附属物评估报告
import LandAccessoryEvaReport from './AssetEvaluation/LandAccessoryEvaReport.vue' // 资产评估 -- 土地附着物评估报告
import EquipmentEvaReport from './AssetEvaluation/EquipmentEvaReport.vue' // 资产评估 -- 设施设备评估报告
import SpecialEquipmentEvaReport from './AssetEvaluation/SpecialEquipmentEvaReport.vue' // 资产评估 -- 农村小型专项设施评估报告

import SchemeBase from './SchemeBase/Index.vue' // 模拟安置

import RelocationArrange from './ResettleConfirm/Relocation/Index.vue' // 安置确认 -- 搬迁安置
import ProduceArrange from './ResettleConfirm/Produce/Index.vue' // 安置确认 -- 生产安置
import GraveArrange from './ResettleConfirm/Grave/Index.vue' // 安置确认 -- 坟墓安置

import ProdLand from './SiteConfirmation/ProdLand/Index.vue' // 择址确认 -- 生产用地
import SiteSel from './SiteConfirmation/SiteSel/Index.vue' // 择址确认 -- 择房择址
import TombSiteSel from './SiteConfirmation/TombSiteSel/Index.vue' // 择址确认 -- 坟墓择址

import HouseholdAgreementSign from './Agreement/HouseholdAgreementSign.vue' // 居民户 -- 协议签订
import EntRelocationAgreement from './Agreement/EntRelocationAgreement.vue' // 企业 -- 动迁协议
import IndividualRelocationAgreement from './IndividualRelocationAgreement.vue' // 个体户 -- 动迁协议
import VillageRelocationAgreement from './Agreement/VillageRelocationAgreement.vue' // 村集体 -- 动迁安置协议
import VillageTransitionAgreement from './Agreement/VillageTransitionAgreement.vue' // 村集体 -- 过渡安置协议

import CreateCard from './CreateCard/Index.vue' // 居民户移民建卡
import EntCardEstablishment from './EntCardEstablishment/Index.vue' // 企业建卡
import IndividualCardEstablishment from './IndividualCardEstablishment/Index.vue' // 个体户建卡

import HouseVacate from './Vacate/House/Index.vue' // 腾空过渡 房屋腾空
import LandVacate from './Vacate/Land/Index.vue' // 腾空过渡 土地腾空
import TransitionResettle from './Vacate/Transition/Index.vue' // 腾空过渡 过渡安置

import SelfBuildHouse from './RelocatePlacement/SelfBuildHouse/Index.vue' // 搬迁安置 -- 自建房
import Apartment from './RelocatePlacement/Apartment/Index.vue' // 搬迁安置 -- 公寓房
import CentralizedSupport from './RelocatePlacement/CentralizedSupport/Index.vue' // 搬迁安置 -- 集中供养

import FarmingResettle from './ProductionResettle/Farming/Index.vue' // 生产安置 农业安置
import InsureResettle from './ProductionResettle/Insure/Index.vue' // 生产安置 养老保险
import SelfResettle from './ProductionResettle/FindSelf/Index.vue' // 生产安置 自谋职业

import Procedures from './Procedures/Index.vue' // 居民户 -- 相关手续
import EntProcedures from './EntProcedures/Index.vue' // 企业 -- 相关手续
import IndividualProcedures from './IndividualProcedures/Index.vue' // 个体户 -- 相关手续

import CollectiveAssetDisposal from './CollectiveAssetDisposal/Index.vue' // 村集体 -- 集体资产处置方法

import UserInfo from './components/UserInfo.vue'
import { useRouter } from 'vue-router'

const titleMsg = (type: string, index: number) => {
  if (type == 'Landlord') {
    if (index === 1) {
      return '居民户信息'
    }
    return '居民户实施'
  } else if (type == 'Enterprise') {
    if (index === 1) {
      return '企业信息'
    }
    return '企业实施'
  } else if (type == 'IndividualB') {
    if (index === 1) {
      return '个体工商信息'
    }
    return '个体工商户实施'
  } else {
    if (index === 1) {
      return '村集体信息'
    }
    return '村集体实施'
  }
}

const { currentRoute, back } = useRouter()
const baseInfo = ref<any>({})
const tabsList = ref<any>([])
const subTabsList = ref<any>([])
const tabCurrentId = ref<number>(0)
const subTabCurrentId = ref<number>(TabIds[0])
const { doorNo, householdId, type } = currentRoute.value.query as any
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
  subTabCurrentId.value = 1
}

const onSubTabClick = (tabItem) => {
  if (subTabCurrentId.value === tabItem.id) {
    return
  }
  subTabCurrentId.value = tabItem.id
}

onMounted(() => {
  if (type == 'PeasantHousehold') {
    tabsList.value = HouseholdTabs
    subTabsList.value = HouseholdSubTabs
  } else if (type == 'Enterprise') {
    tabsList.value = EnterpriseTabs
    subTabsList.value = EnterpriseSubTabs
  } else if (type == 'IndividualB') {
    tabsList.value = IndividualTabs
    subTabsList.value = IndividualSubTabs
  } else if (type == 'Village') {
    tabsList.value = VillageTabs
    subTabsList.value = VillageSubTabs
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
      padding: 0 20px;
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
