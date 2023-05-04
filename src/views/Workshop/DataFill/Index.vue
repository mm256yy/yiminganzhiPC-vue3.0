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
        <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
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
        <div class="tabs"> </div>
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
            v-if="baseInfo.reportStatus === ReportStatus.UnReport"
            type="primary"
            :icon="EscalationIcon"
            @click="onReportData"
          >
            填报完成
          </ElButton>
        </ElSpace>
      </div>

      <UserInfo :baseInfo="baseInfo" :type="type" />
      <!-- EnterpriseTabs -->
      <div class="report-tabs">
        <div
          :class="['report-tab-item', reportTabCurrentId === item.id ? 'active' : '']"
          v-for="item in tabsType"
          :key="item.id"
          @click="onReportTabClick(item)"
        >
          <Icon :icon="item.icon" color="#3E73EC" />
          <div class="tit">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="data-fill-body" v-if="type == 'Landlord'">
      <!-- 人口信息 -->
      <Demographic
        :doorNo="doorNo"
        v-if="reportTabCurrentId === ReportTabIds[0]"
        :surveyStatus="surveyStatus"
      />
      <!-- 房屋信息 -->
      <House
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[1]"
        :surveyStatus="surveyStatus"
      />
      <!-- 附属物信息 -->
      <Accessory
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[2]"
        :surveyStatus="surveyStatus"
      />
      <!-- 0星果木 -->
      <Fruitwood
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[3]"
        :surveyStatus="surveyStatus"
      />
      <FamilyIncome
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[5]"
        :surveyStatus="surveyStatus"
      />
      <!-- 安置 -->
      <Resettlement
        :doorNo="doorNo"
        :baseInfo="baseInfo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[6]"
        :surveyStatus="surveyStatus"
      />
      <!-- 坟墓 -->
      <Grave
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[4]"
        :surveyStatus="surveyStatus"
      />
      <!-- 附件上传 -->
      <Enclosure
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[7]"
        :surveyStatus="surveyStatus"
      />
    </div>

    <div class="data-fill-body" v-if="type == 'Enterprise'">
      <EnterpriseInfor
        :doorNo="doorNo"
        v-if="reportTabCurrentId === ReportTabIds[0]"
        :surveyStatus="surveyStatus"
        :householdId="householdId"
      />
      <House
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[1]"
        :surveyStatus="surveyStatus"
      />
      <Accessory
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[2]"
        :surveyStatus="surveyStatus"
      />
      <Fruitwood
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[3]"
        :surveyStatus="surveyStatus"
      />
      <DeviceInfor
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[4]"
        :surveyStatus="surveyStatus"
      />

      <BusinessStatus
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[5]"
        :surveyStatus="surveyStatus"
      />
      <Enclosure
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[6]"
        :surveyStatus="surveyStatus"
      />
    </div>

    <div class="data-fill-body" v-if="type == 'IndividualB'">
      <IndividualBInfor
        :doorNo="doorNo"
        v-if="reportTabCurrentId === ReportTabIds[0]"
        :surveyStatus="surveyStatus"
        :householdId="householdId"
      />
      <House
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[1]"
        :surveyStatus="surveyStatus"
      />
      <Accessory
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[3]"
        :surveyStatus="surveyStatus"
      />
      <Fruitwood
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[2]"
        :surveyStatus="surveyStatus"
      />
      <DeviceInfor
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[4]"
        :surveyStatus="surveyStatus"
      />
      <Enclosure
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[5]"
        :surveyStatus="surveyStatus"
      />
    </div>

    <div class="data-fill-body" v-if="type == 'villageInfoC'">
      <House
        :doorNo="doorNo"
        :householdId="householdId"
        v-if="reportTabCurrentId === ReportTabIds[0]"
        :surveyStatus="surveyStatus"
      />

      <Fruitwood
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[1]"
        :surveyStatus="surveyStatus"
      />
      <!-- 附属物 -->
      <Accessory
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[2]"
        :surveyStatus="surveyStatus"
      />
      <VillageDeviceInfor
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[3]"
        :surveyStatus="surveyStatus"
      />

      <Enclosure
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[5]"
        :surveyStatus="surveyStatus"
      />
      <VillageGrave
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === ReportTabIds[4]"
        :surveyStatus="surveyStatus"
      />
    </div>

    <Print
      :show="printDialog"
      :landlordIds="[householdId]"
      @close="onPrintDialogClose"
      :baseInfo="baseInfo"
    />

    <ElDialog
      class="report-dialog"
      title="填报完成"
      :model-value="reportDialog"
      :width="710"
      @close="onClose"
      alignCenter
      appendToBody
      :closeOnClickModal="false"
      destroy-on-close
    >
      <div class="report-cont">
        <div class="report-item" v-for="item in reportResult" :key="item">
          <div class="report-tit">{{ item.split('：')[0] }}:</div>
          <div class="report-txt">{{ item.split('：')[1] }}</div>
        </div>
      </div>

      <div class="tips">
        <Icon icon="ph:info-fill" color="#ED5454" :size="20" />
        <div class="ml-6px">以上信息还未填写，是否继续上传数据？</div>
      </div>

      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onConfirmReport">确认</ElButton>
      </template>
    </ElDialog>
  </WorkContentWrap>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { globalData } from '@/config/fill'

export default defineComponent({
  beforeRouteEnter(to, _from, next) {
    console.log(to, 'to')
    if (to.path === '/Workshop/DataFill') {
      // 实物采集
      globalData.currentSurveyStatus = SurveyStatusEnum.Survey
    } else {
      // 实物复核
      globalData.currentSurveyStatus = SurveyStatusEnum.Review
    }
    next()
  }
})
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElDialog,
  ElMessage,
  ElSpace
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ReportTabs,
  // FlowTabs,
  ReportTabIds,
  EnterpriseTabs,
  IndividualBTabs,
  villageInfoCTabs
} from './config'

import { getLandlordByIdApi, reportLandlordApi } from '@/api/workshop/landlord/service'
import { ReportStatus } from '@/views/Workshop/DataFill/config'

import Demographic from './Demographic/Index.vue'
import House from './House/Index.vue'
import Accessory from './Accessory/Index.vue'
import Fruitwood from './Fruitwood/Index.vue'
import Grave from './Grave/Index.vue'
import Enclosure from './Enclosure/Index.vue'
import FamilyIncome from './FamilyIncome/Index.vue'
import VillageGrave from './VillageComponents/Grave/Index.vue'
import BusinessStatus from './EnterpriseInfoComponents/BusinessStatus/Index.vue'
import EnterpriseInfor from './EnterpriseInfoComponents/EnterpriseInfor/Index.vue'
import DeviceInfor from './EnterpriseInfoComponents/DeviceInfor/Index.vue'

import IndividualBInfor from './IndividualBComponents/IndividualBInfor/Index.vue'
// import villageInfoCInfor from './VillageComponents/villageInfoCInfor/Index.vue'
import VillageDeviceInfor from './VillageComponents/VillageDeviceInfor/Index.vue'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import Resettlement from './Resettlement/Index.vue'
import UserInfo from './components/UserInfo.vue'
import Print from './components/Print.vue'
import { useRouter } from 'vue-router'
const { currentRoute, back } = useRouter()
const { doorNo, householdId, type } = currentRoute.value.query as any
const baseInfo = ref<any>({})
const tabsType = ref<any>([])
const surveyStatus = ref<SurveyStatusEnum>(SurveyStatusEnum.Survey)
const reportTabCurrentId = ref<number>(ReportTabIds[0])

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
    console.log(res)

    baseInfo.value = res
  })
}

getLandlordInfo()
const { push } = useRouter()

watch(
  () => globalData.currentSurveyStatus,
  (val) => {
    surveyStatus.value = val
  }
)

const onReportTabClick = (tabItem) => {
  if (reportTabCurrentId.value === tabItem.id) {
    return
  }
  reportTabCurrentId.value = tabItem.id
}

const onClose = () => {
  reportDialog.value = false
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
  surveyStatus.value = globalData.currentSurveyStatus
})
// 填报完成
const onReportData = async () => {
  let typeFlag = ''
  if (type == 'Landlord') {
    typeFlag = 'PeasantHousehold'
  } else if (type == 'Enterprise') {
    typeFlag = 'Company'
  } else if (type == 'IndividualB') {
    typeFlag = 'IndividualHousehold'
  } else if (type == 'villageInfoC') {
    typeFlag = 'Village'
  }

  const result = await reportLandlordApi(householdId, true, typeFlag)
  if (result && Array.isArray(result)) {
    reportDialog.value = true
    reportResult.value = result
  } else {
    ElMessage.success('上报成功！')
    getLandlordInfo()
    back()
  }
}

const onConfirmReport = async () => {
  let typeFlag = ''
  if (type == 'Landlord') {
    typeFlag = 'PeasantHousehold'
  } else if (type == 'Enterprise') {
    typeFlag = 'Company'
  } else if (type == 'IndividualB') {
    typeFlag = 'IndividualHousehold'
  } else if (type == 'villageInfoC') {
    typeFlag = 'Village'
  }
  const result = await reportLandlordApi(householdId, false, typeFlag)
  if (result && Object.prototype.toString.call(result) === '[object String]') {
    ElMessage.success('上报成功！')
    getLandlordInfo()
    back()
  }
}

const onBack = () => {
  push('/Workshop/Landlord')
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
