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
          {{
            type == 'Landlord'
              ? '居民户信息采集'
              : type == 'Enterprise'
              ? '企业信息采集'
              : type == 'IndividualB'
              ? '工商个体信息采集'
              : '村集体信息采集'
          }}
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
        <ElSpace>
          <ElButton
            :icon="printIcon"
            v-if="type == 'Landlord' || type == 'Enterprise' || type == 'IndividualB'"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onPrint"
          >
            打印表格
          </ElButton>
          <ElButton
            v-if="baseInfo.fillStatus === FillStatus.Fill"
            type="primary"
            :icon="EscalationIcon"
            @click="onReportData"
          >
            填报完成
          </ElButton>
        </ElSpace>
      </div>

      <UserInfo :baseInfo="baseInfo" :type="type" :tabCurrentId="tabCurrentId" />
      <!-- EnterpriseTabs -->
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
        v-if="reportTabCurrentId === ReportTabIds[0] && tabCurrentId == 1"
      />

      <!-- 资格认定 -- 房屋确权 -->
      <houseConfirmation
        :doorNo="doorNo"
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
        v-else-if="reportTabCurrentId === ReportTabIds[1] && tabCurrentId == 2"
      />

      <!-- 安置确认 -- 坟墓安置 -->
      <gaveArrange
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        v-else-if="reportTabCurrentId === ReportTabIds[2] && tabCurrentId == 2"
      />

      <!-- 移民建卡 -->
      <createCard :doorNo="doorNo" v-if="tabCurrentId == 3" />

      <Agreement v-if="tabCurrentId == 4" />

      <!-- 动迁安置 -- 房屋腾空确认单 -->
      <house-soar
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[0]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 青苗腾空确认单 -->
      <green-seedlings-soar
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[1]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 择房确认单 -->
      <choose-house
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[2]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 择址确认单 -->
      <site-selection
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[3]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 建房告知单 -->
      <build-house
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[4]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 择房交付告知单 -->
      <optional-delivery
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[5]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 坟墓择址确认单 -->
      <tomb-address
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[6]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 -- 坟墓迁移告知单 -->
      <tomb-migrations
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[7]"
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
      />

      <!-- 动迁安置 生产用地 -->
      <production-land
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[8]"
      />
      <!-- 动迁安置 社保缴费 -->
      <social-security
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[9]"
      />

      <!-- 动迁安置 自建房 -->
      <build-room
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[10]"
      />

      <!-- 动迁安置 安置进度 -->
      <placement-progress
        :doorNo="doorNo"
        :householdId="Number(householdId)"
        :projectId="Number(projectId)"
        :uid="uid"
        v-show="tabCurrentId == 5 && reportTabCurrentId === ReportTabIds[11]"
      />
    </div>

    <!-- <div class="data-fill-body" v-if="type == 'Enterprise'"> </div>

    <div class="data-fill-body" v-if="type == 'IndividualB'"> </div> -->

    <Print
      :show="printDialog"
      :landlordIds="[householdId]"
      @close="onPrintDialogClose"
      :baseInfo="baseInfo"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElMessage, ElSpace } from 'element-plus'
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

import {
  getLandlordByIdApi,
  reportLandlordApi
} from '@/api/putIntoEffect/putIntoEffectDataFill/service'
import { FillStatus } from '@/views/putIntoEffect/putIntoEffectDataFill/config'

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
import createCard from './createCard/Index.vue' // 移民建卡

import Agreement from './Agreement/Agreement.vue'

import HouseSoar from './RelocationResettle/HouseSoar/Index.vue' // 动迁安置 -- 房屋腾空确认单
import GreenSeedlingsSoar from './RelocationResettle/GreenSeedlingsSoar/Index.vue' // 动迁安置 -- 青苗腾空确认单
import ChooseHouse from './RelocationResettle/ChooseHouse/Index.vue' // 动迁安置 -- 择房确认单
import SiteSelection from './RelocationResettle/SiteSelection/Index.vue' // 动迁安置 -- 择址确认单
import BuildHouse from './RelocationResettle/BuildHouse/Index.vue' // 动迁安置 -- 建房告知单
import OptionalDelivery from './RelocationResettle/OptionalDelivery/Index.vue' // 动迁安置 -- 择房交付告知单
import TombAddress from './RelocationResettle/TombAddress/Index.vue' // 动迁安置 -- 坟墓择址确认单
import TombMigrations from './RelocationResettle/TombMigrations/Index.vue' // 动迁安置 -- 坟墓迁移告知单

import ProductionLand from './RelocationResettle/ProductionLand/Index.vue' // 动迁安置 生产用地
import SocialSecurity from './RelocationResettle/SocialSecurity/Index.vue' // 动迁安置 社保缴费
import BuildRoom from './RelocationResettle/BuildRoom/Index.vue' // 动迁安置 自建房
import PlacementProgress from './RelocationResettle/PlacementProgress/Index.vue' // 动迁安置 安置进度

// import Resettlement from './Resettlement/Index.vue'
import UserInfo from './components/UserInfo.vue'
import Print from './components/Print.vue'
import { useRouter } from 'vue-router'
const { currentRoute, back } = useRouter()
const baseInfo = ref<any>({})
const tabsType = ref<any>([])
const tabCurrentId = ref<number>(0)
const reportTabCurrentId = ref<number>(ReportTabIds[0])
const { doorNo, householdId, type, projectId, uid } = currentRoute.value.query as any
const reportDialog = ref<boolean>(false)
const printDialog = ref<boolean>(false)
const reportResult = ref<string[]>([])

const EscalationIcon = useIcon({ icon: 'carbon:send-alt' })
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const printIcon = useIcon({ icon: 'ion:print-outline' })

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

// 填报完成
const onReportData = async () => {
  const result = await reportLandlordApi(householdId)
  if (result && Array.isArray(result)) {
    reportDialog.value = true
    reportResult.value = result
  } else {
    ElMessage.success('上报成功！')
    getLandlordInfo()
    back()
  }
}

const onBack = () => {
  back()
}

const onPrint = () => {
  printDialog.value = true
}

const onPrintDialogClose = () => {
  printDialog.value = false
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
