<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <Icon :icon="infoData.icon" color="#3E73EC" />
        <span class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</span>
        <span class="pl-8px text-size-14px text-[#1C5DF1]">{{
          filterViewDoorNo(props.baseInfo)
        }}</span>
      </div>
      <div v-if="props.type == 'Landlord'"
        >关联个体户：<span
          class="pl-8px text-size-14px text-[#1C5DF1]"
          @click="handleHouseholdClick"
          >{{ props.baseInfo.relateIndividualName || '-' }}</span
        ></div
      >
      <div v-if="props.type == 'Landlord'"
        >关联企业：<span class="pl-8px text-size-14px text-[#1C5DF1]" @click="handleCompanyClick">{{
          props.baseInfo.relateCompanyName || '-'
        }}</span></div
      >
      <div v-if="props.type == 'Enterprise' || props.type == 'IndividualB'">
        关联居民户：<span
          class="pl-8px text-size-14px text-[#1C5DF1]"
          @click="handleLandlordClick"
          >{{ props.baseInfo.householderName || '-' }}</span
        ></div
      >
      <div
        :class="{
          status: true,
          success: props.baseInfo.reportStatus === ReportStatus.ReportSucceed
        }"
        ><span class="point"></span
        >{{ props.baseInfo.reportStatus === ReportStatus.ReportSucceed ? '已填报' : '未填报' }}</div
      >
    </div>

    <div class="other" v-if="type == 'Landlord'">
      <div class="info-item">
        <div class="tit">行政村名称：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">自然村名称：</div>
        <div class="txt">{{ props.baseInfo.virutalVillageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">联系电话：</div>
        <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">家庭人数：</div>
        <div class="txt">{{ props.baseInfo.familyNum || '-' }}</div>
      </div>
    </div>
    <div class="other" v-if="type == 'Enterprise'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.areaCodeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">法人：</div>
        <div class="txt">{{ props.baseInfo.legalPersonName || '-' }}</div>
      </div>
    </div>

    <div class="other" v-if="type == 'IndividualB'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.areaCodeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">法人：</div>
        <div class="txt">{{ props.baseInfo.legalPersonName || '-' }}</div>
      </div>
    </div>

    <div class="other" v-if="type == 'villageInfoC'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.areaCodeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">联系方式：</div>
        <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { globalData } from '@/config/fill'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

export default defineComponent({
  beforeRouteEnter(to, _from, next) {
    console.log(to, 'to')
    if (to.path === '/Workshop/Enterprise') {
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

<script lang="ts" setup>
import { ReportStatus } from '../config'
import { ref, onMounted } from 'vue'
import { filterViewDoorNo } from '@/utils'
import { useRouter } from 'vue-router'
const { push } = useRouter()

interface PropsType {
  baseInfo: any
  type: any
}

const infoData = ref<any>({ icon: 'mdi:user-circle' })
const props = defineProps<PropsType>()
onMounted(() => {
  if (props.type == 'Landlord') {
    infoData.value = { icon: 'mdi:user-circle' }
  } else if (props.type == 'Enterprise') {
    infoData.value = { icon: 'carbon:enterprise' }
  } else if (props.type == 'IndividualB') {
    infoData.value = { icon: 'material-symbols:add-business' }
  } else if (props.type == 'villageInfoC') {
    infoData.value = { icon: 'ic:round-holiday-village' }
  }
  console.log(props.baseInfo, 'baseInfo')
})
const handleHouseholdClick = () => {
  console.log('跳转居民户')
  if (!props.baseInfo.relateIndividualName) return false
  let routerName = 'DataFill'
  if (globalData.currentSurveyStatus === SurveyStatusEnum.Review) {
    routerName = 'DataFillCheck'
  }
  push({
    name: routerName,
    query: {
      householdId: props.baseInfo.relateIndividualId,
      doorNo: props.baseInfo.relateIndividualDoorNo,
      type: 'IndividualB'
    }
  })
}
const handleCompanyClick = () => {
  console.log('跳转企业')
  if (!props.baseInfo.relateCompanyName) return false
  let routerName = 'DataFill'
  if (globalData.currentSurveyStatus === SurveyStatusEnum.Review) {
    routerName = 'DataFillCheck'
  }
  push({
    name: routerName,
    query: {
      householdId: props.baseInfo.relateCompanyId,
      doorNo: props.baseInfo.relateCompanyDoorNo,
      type: 'Enterprise'
    }
  })
}
const handleLandlordClick = () => {
  console.log('跳转居民户')
  if (!props.baseInfo.householderName) return false
  let routerName = 'DataFill'
  if (globalData.currentSurveyStatus === SurveyStatusEnum.Review) {
    routerName = 'DataFillCheck'
  }
  push({
    name: routerName,
    query: {
      householdId: props.baseInfo.householderId,
      doorNo: props.baseInfo.householderDoorNo,
      type: 'Landlord'
    }
  })
}
</script>

<style lang="less" scoped>
.user-info {
  min-height: 88px;
  margin-top: 14px;
  background: #f5f7fa;
  border: 1px solid #e8eaf0;
  border-radius: 4px;

  .base {
    display: flex;
    height: 40px;
    padding: 0 16px;
    background: rgba(237, 245, 255, 1);
    border-bottom: 1px dashed #e6ecf4;
    align-items: center;
    justify-content: space-between;

    .user {
      display: flex;
      align-items: center;
    }

    .status {
      display: flex;
      height: 24px;
      padding: 0 13px 0 10px;
      font-size: 12px;
      color: #ff2d2d;
      background: #ffffff;
      border: 1px solid #ff5d5d;
      border-radius: 14px;
      align-items: center;

      .point {
        width: 6px;
        height: 6px;
        margin-right: 5px;
        background: #ff6767;
        border-radius: 50%;
      }

      &.success {
        color: #30a952;
        border: 1px solid #30a952;

        .point {
          background: #30a952;
        }
      }
    }
  }

  .other {
    display: flex;
    height: 48px;
    padding: 0 16px;
    align-items: center;
    background: rgba(237, 245, 255, 1);

    .info-item {
      display: flex;
      margin-right: 40px;
      font-size: 14px;
      line-height: 28px;
      color: #000;
      align-items: center;

      .tit {
        color: rgb(171, 173, 175);
      }

      .txt {
        font-weight: 500;
      }
    }
  }
}
</style>
