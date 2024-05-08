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
            <Icon
              v-if="item.active"
              class="ml-2px"
              icon="gg:check-o"
              :color="tabCurrentId === item.id ? '#fff' : '#3e73ec'"
            />
          </div>
        </div>
      </div>

      <!-- 用户信息 -->
      <UserInfo
        :baseInfo="baseInfo"
        :householdId="Number(householdId)"
        :doorNo="doorNo"
        :type="type"
        :tabCurrentId="tabCurrentId"
        :fillingStatus="fillingStatus"
        @update-data="getLandlordInfo"
        v-if="title != '资格认定'"
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
            <Icon v-if="item.active" class="active-icon" icon="gg:check-o" color="#3e73ec" />
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: row-reverse; gap: 10px; margin-top: 20px">
        <ElButton v-if="tabCurrentId !== 0" type="primary" @click="onFeedback">信息反馈</ElButton>
        <!-- <ElButton v-if="comdbe()" @click="handenoe" type="primary">打印</ElButton> -->
      </div>
    </div>

    <!-- 居民户 -->
    <div class="data-fill-body" v-if="type === 'PeasantHousehold'">
      <!-- 居民户信息 -->
      <household-info
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @update-data="getLandlordInfo"
        v-if="tabCurrentId === 0"
      />

      <!-- 资格认定 -->
      <template v-if="tabCurrentId === 1">
        <!-- 人口核定 -->
        <population-check
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @refresh="getLandlordInfo"
          v-if="subTabCurrentId === TabIds[0]"
          @update-data="getLandlordInfo"
        />

        <!-- 房屋产权 -->
        <house-property
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          :householdId="householdId"
          v-if="subTabCurrentId === TabIds[1]"
          @update-data="getLandlordInfo"
        />
      </template>

      <!-- 资产评估 -->
      <template v-if="tabCurrentId === 2">
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
      <scheme-base
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId === 3"
        @update-data="getLandlordInfo"
      />

      <!-- 安置确认 -->
      <template v-if="tabCurrentId === 4">
        <!-- 搬迁安置 -->
        <relocation-arrange
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 生产安置 -->
        <produce-arrange
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
          v-if="subTabCurrentId === TabIds[1]"
        />

        <!-- 坟墓确认 -->
        <grave-arrange
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[2]"
          @update-data="getLandlordInfo"
        />
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
      <household-agreement-sign
        :doorNo="doorNo"
        v-if="tabCurrentId === 6"
        @update-data="getLandlordInfo"
      />

      <!-- 居民户 -- 移民建卡 -->
      <create-card
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @update-data="getLandlordInfo"
        v-if="tabCurrentId === 7"
      />

      <!-- 腾空过渡 -->
      <template v-if="tabCurrentId == 8">
        <!-- 房屋腾空 -->
        <house-vacate
          :type="type"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 土地腾让 -->
        <land-vacate
          :type="type"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[1]"
        />

        <!-- 过渡安置 -->
        <transition-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[2]"
        />
      </template>

      <!-- 搬迁安置 -->
      <template v-if="tabCurrentId === 9">
        <!-- 自建房 -->
        <SelfBuildHouse
          v-if="baseInfo.houseAreaType === HouseType.homestead"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 公寓房 -->
        <Apartment
          v-if="baseInfo.houseAreaType === HouseType.flat"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 集中供养 -->
        <CentralizedSupport
          v-if="baseInfo.houseAreaType === HouseType.concentrate"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />

        <!-- 自谋出路 -->
        <SelfFindWay
          v-if="baseInfo.houseAreaType === HouseType.oneself"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          @update-data="getLandlordInfo"
        />
        <div
          v-if="!houseTypeList?.includes(baseInfo.houseAreaType)"
          class="flex justify-center items-center h-[200px]"
        >
          该户还未进行安置确认
        </div>
      </template>

      <!-- 生产安置 -->
      <template v-if="tabCurrentId === 10">
        <!-- 农业安置 -->
        <farming-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[0]"
          @update-data="getLandlordInfo"
        />

        <!-- 养老保险 -->
        <insure-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[1]"
          @update-data="getLandlordInfo"
        />

        <!-- 自谋职业 -->
        <self-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[2]"
          @update-data="getLandlordInfo"
        />
      </template>

      <!-- 相关手续 -->
      <Procedures
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-if="tabCurrentId == 11"
        @update-data="getLandlordInfo"
      />
    </div>

    <!-- 企业 -->
    <div class="data-fill-body" v-if="type === 'Enterprise'">
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
        <equipment-eva-report :doorNo="doorNo" v-if="subTabCurrentId === TabIds[2]" />
      </template>

      <!-- 企业建卡 -->
      <ent-card-establishment
        v-if="tabCurrentId === 1"
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @update-data="getLandlordInfo"
      />

      <!-- 腾空 -->
      <template v-if="tabCurrentId === 2">
        <!-- 房屋腾空 -->
        <house-vacate
          :type="type"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 土地腾让 -->
        <land-vacate
          :type="type"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[1]"
        />
      </template>

      <!-- 动迁协议 -->
      <ent-relocation-agreement
        :doorNo="doorNo"
        v-if="tabCurrentId === 3"
        @update-data="getLandlordInfo"
      />
      <!-- 相关手续 -->
      <ent-procedures :doorNo="doorNo" v-if="tabCurrentId === 4" />
    </div>

    <!-- 个体工商户 -->
    <div class="data-fill-body" v-if="type === 'IndividualB'">
      <!-- 资产评估 -->
      <template v-if="tabCurrentId === 0">
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
        <equipment-eva-report :doorNo="doorNo" v-if="subTabCurrentId == TabIds[2]" />
      </template>

      <!-- 个体户建卡 -->
      <individual-card-establishment
        v-if="tabCurrentId === 1"
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @update-data="getLandlordInfo"
      />

      <!-- 腾空 -->
      <template v-if="tabCurrentId === 2">
        <!-- 房屋腾空 -->
        <house-vacate
          :type="type"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[0]"
        />

        <!-- 土地腾让 -->
        <land-vacate
          :type="type"
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[1]"
        />
      </template>

      <!-- 动迁协议 -->
      <individual-relocation-agreement
        :doorNo="doorNo"
        v-if="tabCurrentId === 3"
        @update-data="getLandlordInfo"
      />

      <!-- 相关手续 -->
      <individual-procedures :doorNo="doorNo" v-if="tabCurrentId === 4" />
    </div>

    <!-- 村集体 -->
    <div class="data-fill-body" v-if="type === 'Village'">
      <!-- 资产评估 -->
      <template v-if="tabCurrentId === 0">
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
        <special-equipment-eva-report :doorNo="doorNo" v-if="subTabCurrentId === TabIds[2]" />
      </template>

      <!-- 腾空(村集体只有房屋腾空) -->
      <house-vacate :type="type" :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId === 1" />

      <!-- 动迁协议 -->
      <village-relocation-agreement
        :doorNo="doorNo"
        v-if="tabCurrentId === 2"
        @update-data="getLandlordInfo"
      />
      <!-- 集体资产处置方法 -->
      <collective-asset-disposal :doorNo="doorNo" v-if="tabCurrentId === 3" />
      <!-- 村集体建卡 -->
      <VillageCard
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        @update-data="getLandlordInfo"
        v-if="tabCurrentId === 4"
      />
    </div>
    <div class="data-fill-body" v-if="type === 'LandNoMove'">
      <!-- 生产安置 -->
      <Produce :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId === 1" />
      <!-- 只征地不搬迁资产评估 -->
      <AssetEvaluationZ
        v-if="tabCurrentId === 0"
        :type="type"
        :doorNo="doorNo"
        :baseInfo="baseInfo"
      />
      <!-- 只征地不搬迁补偿卡 -->
      <CompensationCard v-if="tabCurrentId === 3" :doorNo="doorNo" :baseInfo="baseInfo" />
      <!-- 土地腾让 -->
      <land-vacate :type="type" :doorNo="doorNo" :baseInfo="baseInfo" v-if="tabCurrentId === 2" />
      <!-- 只征地不搬迁 -- 协议签订 -->
      <Zd-xy :doorNo="doorNo" v-if="tabCurrentId === 4" @update-data="getLandlordInfo" />
      <!-- 生产安置确认 -->
      <template v-if="tabCurrentId === 5">
        <!-- 养老保险 -->
        <insure-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[1]"
          @update-data="getLandlordInfo"
        />

        <!-- 自谋职业 -->
        <self-resettle
          :doorNo="doorNo"
          :baseInfo="baseInfo"
          v-if="subTabCurrentId === TabIds[2]"
          @update-data="getLandlordInfo"
        />
      </template>
    </div>

    <FeedbackForm
      :show="feedbackShow"
      :householder="baseInfo.name"
      :doorNo="doorNo"
      :type="feedbackType"
      @close="onFeedbackClose"
    />
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElMessage } from 'element-plus'
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
  VillageSubTabs,
  LandNoMoveTabs,
  LandNoMoveTabss,
  LandNoMoveSubTabs
} from './config'
import { HouseType } from './config'

import { getLandlordByIdApi, getFillingStatusApi } from '@/api/immigrantImplement/common-service'

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
import GraveArrange from './ResettleConfirm/Grave/Index.vue' // 安置确认 -- 坟墓确认

import ProdLand from './SiteConfirmation/ProdLand/Index.vue' // 择址确认 -- 生产用地
import SiteSel from './SiteConfirmation/SiteSel/Index.vue' // 择址确认 -- 选房择址
import TombSiteSel from './SiteConfirmation/TombSiteSel/Index.vue' // 择址确认 -- 坟墓择址

import HouseholdAgreementSign from './Agreement/HouseholdAgreementSign.vue' // 居民户 -- 协议签订
import EntRelocationAgreement from './Agreement/EntRelocationAgreement.vue' // 企业 -- 动迁协议
import IndividualRelocationAgreement from './Agreement/IndividualRelocationAgreement.vue' // 个体户 -- 动迁协议
import VillageRelocationAgreement from './Agreement/VillageRelocationAgreement.vue' // 村集体 -- 动迁协议
import VillageCard from './Agreement/VillageCard.vue' // 村集体 -- 建卡
import CreateCard from './CreateCard/Index.vue' // 居民户移民建卡
import EntCardEstablishment from './EntCardEstablishment/Index.vue' // 企业建卡
import IndividualCardEstablishment from './IndividualCardEstablishment/Index.vue' // 个体户建卡

import HouseVacate from './Vacate/House/Index.vue' // 腾空过渡 房屋腾空
import LandVacate from './Vacate/Land/Index.vue' // 腾空过渡 土地腾空
import TransitionResettle from './Vacate/Transition/Index.vue' // 腾空过渡 过渡安置

import SelfBuildHouse from './RelocatePlacement/SelfBuildHouse/Index.vue' // 搬迁安置 -- 自建房
import Apartment from './RelocatePlacement/Apartment/Index.vue' // 搬迁安置 -- 公寓房
import CentralizedSupport from './RelocatePlacement/CentralizedSupport/Index.vue' // 搬迁安置 -- 集中供养
import SelfFindWay from './RelocatePlacement/SelfFindWay/Index.vue' // 搬迁安置 -- 自谋出路

import FarmingResettle from './ProductionResettle/Farming/Index.vue' // 生产安置 农业安置
import InsureResettle from './ProductionResettle/Insure/Index.vue' // 生产安置 养老保险
import SelfResettle from './ProductionResettle/FindSelf/Index.vue' // 生产安置 自谋职业

import Procedures from './Procedures/Index.vue' // 居民户 -- 相关手续
import EntProcedures from './EntProcedures/Index.vue' // 企业 -- 相关手续
import IndividualProcedures from './IndividualProcedures/Index.vue' // 个体户 -- 相关手续

import CollectiveAssetDisposal from './CollectiveAssetDisposal/Index.vue' // 村集体 -- 集体资产处置方法
import Produce from '@/views/Workshop/ImmigrantImplement/DataFill/Lander/Produce.vue' //资产评估 只征地不搬迁
import ZdXy from '@/views/Workshop/ImmigrantImplement/DataFill/Lander/ZdXy.vue' //征地协议 只征地不搬迁
import AssetEvaluationZ from './AssetEvaluationZ/Index.vue' // 只征地不搬迁资产评估
import CompensationCard from './CompensationCard/Index.vue' // 只征地不搬迁补偿卡
import UserInfo from './components/UserInfo.vue' // 用户基本信息
import FeedbackForm from '@/views/Workshop/Feedback/FeedbackForm.vue'
import { useRouter } from 'vue-router'
import { deepClone } from '@/utils'
const houseTypeList = ref(['homestead', 'flat', 'concentrate', 'oneself'])
const titleMsg = (type: string, index: number) => {
  if (type == 'PeasantHousehold') {
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
  } else if (type == 'Village') {
    if (index === 1) {
      return '村集体信息'
    }
    return '村集体实施'
  } else {
    if (index === 1) {
      return '只征地不搬迁信息'
    }
    return '只征地不搬迁实施'
  }
}

const { currentRoute, back } = useRouter()
const baseInfo = ref<any>({})
const tabsList = ref<any>([])
const subTabsList = ref<any>([])
const tabCurrentId = ref<number>(0)
const subTabCurrentId = ref<number>(TabIds[0])
const { doorNo, householdId, type, nowbody } = currentRoute.value.query as any
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const fillingStatus = ref<string>('')

// 获取填报状态
const getFillingStatus = () => {
  getFillingStatusApi(doorNo).then((res: any) => {
    getStatus(res)
  })
}

// 填报状态判断
const getStatus = (data: any) => {
  const tabsListCopy = deepClone(tabsList.value)
  const subTabsListCopy = deepClone(subTabsList.value)
  if (type === 'PeasantHousehold') {
    if (tabCurrentId.value === 0) {
      fillingStatus.value = data.householdPicStatus // 居民户信息总状态
    } else if (tabCurrentId.value === 1) {
      fillingStatus.value = data.qualificationStatus // 资格认定总状态
    } else if (tabCurrentId.value === 2) {
      fillingStatus.value = data.estimateeStatus // 资产评估总状态
    } else if (tabCurrentId.value === 4) {
      fillingStatus.value = data.arrangementStatus // 安置确认总状态
    } else if (tabCurrentId.value === 5) {
      fillingStatus.value = data.chooseStatus // 择址确认总状态
    } else if (tabCurrentId.value === 6) {
      fillingStatus.value = data.agreementStatus // 协议签订总状态
    } else if (tabCurrentId.value === 7) {
      fillingStatus.value = data.cardStatus // 移民建卡总状态
    } else if (tabCurrentId.value === 8) {
      fillingStatus.value = data.excessSoarStatus // 腾空过渡总状态
    } else if (tabCurrentId.value === 9) {
      fillingStatus.value = data.relocateArrangementAllStatus // 搬迁安置总状态
    } else if (tabCurrentId.value === 10) {
      fillingStatus.value = data.productionArrangementAllStatus // 生产安置总状态
    } else if (tabCurrentId.value === 11) {
      fillingStatus.value = data.proceduresStatus // 相关手续总状态
    }

    // 第一层 Tab
    if (data.householdPicStatus === '1') {
      tabsListCopy[0].active = true // 居民户信息
    }
    if (data.qualificationStatus === '1') {
      tabsListCopy[1].active = true // 资格认定
    }
    if (data.estimateeStatus === '1') {
      tabsListCopy[2].active = true // 资产评估
    }
    if (data.arrangementStatus === '1') {
      tabsListCopy[4].active = true // 安置确认
    }
    if (data.chooseStatus === '1') {
      tabsListCopy[5].active = true // 择址确认
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[7].active = true // 移民建卡
    }
    if (data.cardStatus === '1') {
      tabsListCopy[6].active = true // 协议签订
    }
    if (data.excessSoarStatus === '1') {
      tabsListCopy[8].active = true // 腾空过渡
    }
    if (data.relocateArrangementAllStatus === '1') {
      tabsListCopy[9].active = true // 搬迁安置
    }
    if (data.productionArrangementAllStatus === '1') {
      tabsListCopy[10].active = true // 生产安置
    }
    if (data.proceduresStatus === '1') {
      tabsListCopy[11].active = true // 相关手续
    }
  } else if (type === 'Enterprise') {
    if (tabCurrentId.value === 0) {
      fillingStatus.value = data.estimateeStatus // 资产评估总状态
    } else if (tabCurrentId.value === 1) {
      fillingStatus.value = data.cardStatus // 企业建卡总状态
    } else if (tabCurrentId.value === 2) {
      fillingStatus.value = data.excessSoarStatus // 腾空总状态
    } else if (tabCurrentId.value === 3) {
      fillingStatus.value = data.agreementStatus // 动迁协议总状态
    } else if (tabCurrentId.value === 4) {
      fillingStatus.value = data.proceduresStatus // 相关手续总状态
    }

    // 第一层 Tab
    if (data.estimateeStatus === '1') {
      tabsListCopy[0].active = true // 资产评估
    }
    if (data.cardStatus === '1') {
      tabsListCopy[1].active = true // 企业建卡
    }
    if (data.excessSoarStatus === '1') {
      tabsListCopy[2].active = true // 腾空
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[3].active = true // 动迁协议
    }
    if (data.proceduresStatus === '1') {
      tabsListCopy[4].active = true // 相关手续
    }
  } else if (type === 'IndividualB') {
    if (tabCurrentId.value === 0) {
      fillingStatus.value = data.estimateeStatus // 资产评估总状态
    } else if (tabCurrentId.value === 1) {
      fillingStatus.value = data.cardStatus // 个体户建卡总状态
    } else if (tabCurrentId.value === 2) {
      fillingStatus.value = data.excessSoarStatus // 腾空总状态
    } else if (tabCurrentId.value === 3) {
      fillingStatus.value = data.agreementStatus // 动迁协议总状态
    } else if (tabCurrentId.value === 4) {
      fillingStatus.value = data.proceduresStatus // 相关手续总状态
    }

    // 第一层 Tab
    if (data.estimateeStatus === '1') {
      tabsListCopy[0].active = true
    }
    if (data.cardStatus === '1') {
      tabsListCopy[1].active = true
    }
    if (data.excessSoarStatus === '1') {
      tabsListCopy[2].active = true
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[3].active = true
    }
    if (data.proceduresStatus === '1') {
      tabsListCopy[4].active = true
    }
  } else if (type === 'Village') {
    if (tabCurrentId.value === 0) {
      fillingStatus.value = data.estimateeStatus // 资产评估总状态
    } else if (tabCurrentId.value === 1) {
      fillingStatus.value = data.houseSoarStatus // 腾空总状态   原来用这个 excessSoarStatus  这个是 房屋 土地 过度安置 都为打勾 才会excessSoarStatus为1
    } else if (tabCurrentId.value === 2) {
      fillingStatus.value = data.agreementStatus // 协议签订总状态
    } else if (tabCurrentId.value === 3) {
      fillingStatus.value = data.disposalMeasuresStatus // 集体资产处置方法状态
    }

    // 第一层 Tab
    if (data.estimateeStatus === '1') {
      tabsListCopy[0].active = true // 资产评估
    }
    if (data.houseSoarStatus === '1') {
      tabsListCopy[1].active = true // 腾空
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[2].active = true // 协议签订
    }
    if (data.disposalMeasuresStatus === '1') {
      tabsListCopy[3].active = true // 集体资产处置方法
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[4].active = true // 移民建卡
    }
  } else if (type === 'LandNoMove' && nowbody == 'PeasantHousehold') {
    // 第一层 Tab
    if (data.estimateeStatus === '1') {
      tabsListCopy[0].active = true // 资产评估
    }
    if (data.productionArrangementAllStatus === '1') {
      tabsListCopy[1].active = true // 安置确认
    }
    if (data.landSoarStatus === '1') {
      tabsListCopy[2].active = true // 土地腾让
    }
    if (data.cardStatus === '1') {
      tabsListCopy[3].active = true // 补偿卡
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[4].active = true // 征地协议
    }
    if (data.arrangementStatus === '1') {
      tabsListCopy[5].active = true // 生产安置办理
    }
  } else if (type === 'LandNoMove' && nowbody == 'Other') {
    // 第一层 Tab
    if (data.estimateeStatus === '1') {
      tabsListCopy[0].active = true // 资产评估
    }
    if (data.landSoarStatus === '1') {
      tabsListCopy[1].active = true // 土地腾让
    }
    if (data.cardStatus === '1') {
      tabsListCopy[2].active = true // 补偿卡
    }
    if (data.agreementStatus === '1') {
      tabsListCopy[3].active = true // 征地协议
    }
  }

  // 触发重新渲染
  subTabsListCopy.forEach((item) => {
    if (data[item.key] == '1') {
      item.active = true
    }
  })
  subTabsList.value = subTabsListCopy
  tabsList.value = tabsListCopy
}

// 农户详情
const getLandlordInfo = () => {
  if (!householdId) return
  getLandlordByIdApi(householdId).then((res) => {
    baseInfo.value = res
    console.log(baseInfo.value, 'BBQ')
  })
  getFillingStatus()
}
let title = ref('')
const onTabClick = (tabItem) => {
  // if (tabCurrentId.value === tabItem.id) {
  //   return
  // }
  getLandlordInfo()
  console.log('ty', tabItem)
  title.value = tabItem.name
  tabCurrentId.value = tabItem.id
  subTabCurrentId.value = 1
  getFillingStatus()
}

const onSubTabClick = (tabItem) => {
  if (subTabCurrentId.value === tabItem.id) {
    return
  }
  console.log(tabItem.id)

  subTabCurrentId.value = tabItem.id
}
let times = ref()
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
  } else if (nowbody == 'PeasantHousehold') {
    tabsList.value = LandNoMoveTabs
    subTabsList.value = LandNoMoveSubTabs
  } else if (nowbody == 'Other') {
    tabsList.value = LandNoMoveTabss
    subTabsList.value = []
  }
  getLandlordInfo()
  times.value = setInterval(() => {
    getFillingStatus()
  }, 5000)
})
onBeforeUnmount(() => {
  clearInterval(times.value)
  times.value = null
  console.log(1)
})
const onBack = () => {
  back()
}

/**
 * 意见反馈相关
 */
const feedbackShow = ref<boolean>(false)
const feedbackType = ref<string>('1')
const onFeedback = () => {
  // 拿到阶段
  let feedbacktypeCopy = '1'
  if (type === 'PeasantHousehold') {
    feedbacktypeCopy = `${tabCurrentId.value}`
  }
  if (type === 'Enterprise' || type === 'IndividualB') {
    if (tabCurrentId.value === 0) {
      feedbacktypeCopy = '2' // 资产评估
    } else if (tabCurrentId.value === 1) {
      feedbacktypeCopy = '7'
    } else if (tabCurrentId.value === 2) {
      feedbacktypeCopy = '8'
    } else if (tabCurrentId.value === 3) {
      feedbacktypeCopy = '6'
    } else if (tabCurrentId.value === 4) {
      feedbacktypeCopy = '11'
    }
  }

  if (type === 'Village') {
    if (tabCurrentId.value === 0) {
      feedbacktypeCopy = '2' // 资产评估
    } else if (tabCurrentId.value === 1) {
      feedbacktypeCopy = '8' // 腾空
    } else if (tabCurrentId.value === 2) {
      feedbacktypeCopy = '6'
    } else if (tabCurrentId.value === 3) {
      feedbacktypeCopy = '12' // 集体资产处置方法
    }
  }
  if (type === 'LandNoMove') {
    if (tabCurrentId.value === 1) {
      feedbacktypeCopy = '4'
    } else if (tabCurrentId.value === 2) {
      feedbacktypeCopy = '8'
    } else if (tabCurrentId.value === 3) {
      feedbacktypeCopy = '7'
    } else if (tabCurrentId.value === 4) {
      feedbacktypeCopy = '6'
    } else if (tabCurrentId.value === 4) {
      feedbacktypeCopy = '10'
    }
  }
  console.log(feedbacktypeCopy, 'type')
  feedbackType.value = feedbacktypeCopy
  feedbackShow.value = true
}
const onFeedbackClose = () => {
  feedbackShow.value = false
}
// 意见反馈结束
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
