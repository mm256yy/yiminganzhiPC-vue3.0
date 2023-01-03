<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">居民信息采集</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">数据填报</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="data-fill-head">
      <div class="head-top">
        <div class="tabs">
          <div class="tab-item active">实物采集</div>
          <div class="tab-item">实物采集</div>
          <div class="tab-item">实物采集</div>
        </div>
        <ElButton type="primary" :icon="EscalationIcon" @click="onReportData">数据上报</ElButton>
      </div>

      <div class="user-info">
        <div class="base">
          <div class="user">
            <Icon icon="mdi:user-circle" color="#3E73EC" />
            <span class="pl-12px text-size-16px text-[#000]">{{ baseInfo.name }}</span>
            <span class="pl-8px text-size-14px text-[#000]">{{ baseInfo.doorNo }}</span>
          </div>
          <div :class="{ status: true, success: baseInfo.status === '1' }"
            ><span class="point"></span>{{ baseInfo.status === '1' ? '已填报' : '未填报' }}</div
          >
        </div>

        <div class="other">
          <div class="info-item">
            <div class="tit">行政村名称：</div>
            <div class="txt">{{ baseInfo.villageText || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="tit">自然村名称：</div>
            <div class="txt">{{ baseInfo.virutalVillageText || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="tit">所在位置：</div>
            <div class="txt">{{ baseInfo.address || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="tit">联系电话：</div>
            <div class="txt">{{ baseInfo.phone || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="tit">家庭人数：</div>
            <div class="txt">{{ baseInfo.familyNum || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="report-tabs">
        <div
          :class="['report-tab-item', reportTabCurrentId === item.id ? 'active' : '']"
          v-for="item in ReportTabs"
          :key="item.id"
          @click="onReportTabClick(item)"
        >
          <Icon :icon="item.icon" color="#3E73EC" />
          <div class="tit">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="data-fill-body">
      <Demographic :doorNo="doorNo" v-if="reportTabCurrentId === 1" />
      <House :doorNo="doorNo" v-else-if="reportTabCurrentId === 2" />
      <Accessory :doorNo="doorNo" :householdId="householdId" v-else-if="reportTabCurrentId === 3" />
      <Fruitwood :doorNo="doorNo" :householdId="householdId" v-else-if="reportTabCurrentId === 4" />
      <FamilyIncome
        :doorNo="doorNo"
        :householdId="householdId"
        v-else-if="reportTabCurrentId === 5"
      />
      <div v-else-if="reportTabCurrentId === 6">安置意愿</div>
      <Grave :doorNo="doorNo" :householdId="householdId" v-else-if="reportTabCurrentId === 7" />
      <Enclosure :doorNo="doorNo" :householdId="householdId" v-else-if="reportTabCurrentId === 8" />
    </div>

    <ElDialog
      class="report-dialog"
      title="数据上报"
      :model-value="reportDialog"
      :width="500"
      @close="onClose"
      alignCenter
      appendToBody
      :closeOnClickModal="false"
      destroy-on-close
    >
      <div class="report-cont">
        <div class="report-item">
          <div class="report-tit">人口信息采集:</div>
          <div class="report-txt">未添加户主外人员</div>
        </div>
        <div class="report-item">
          <div class="report-tit">人口信息采集:</div>
          <div class="report-txt">未添加户主外人员</div>
        </div>
      </div>

      <div class="tips">
        <Icon icon="ph:info-fill" color="#ED5454" :size="20" />
        <div class="ml-6px">以上信息还未填写，是否继续上传数据？</div>
      </div>

      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary">确认</ElButton>
      </template>
    </ElDialog>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElDialog } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import { ReportTabs } from './config'
import { getLandlordByIdApi } from '@/api/workshop/landlord/service'

import Demographic from './Demographic/Index.vue'
import House from './House/Index.vue'
import Accessory from './Accessory/Index.vue'
import Fruitwood from './Fruitwood/Index.vue'
import Grave from './Grave/Index.vue'
import Enclosure from './Enclosure/Index.vue'
import FamilyIncome from './FamilyIncome/Index.vue'

const baseInfo = ref<any>({})
const reportTabCurrentId = ref<number>(1)
const doorNo = '006014084' // 农户号
const householdId = 6607 // 农户ID
const reportDialog = ref<boolean>(false)

const EscalationIcon = useIcon({
  icon: 'carbon:send-alt'
})

// 农户详情
const getLandlordInfo = () => {
  getLandlordByIdApi(householdId).then((res) => {
    baseInfo.value = res
  })
}

getLandlordInfo()

const onReportTabClick = (tabItem) => {
  reportTabCurrentId.value = tabItem.id
}

const onClose = () => {
  reportDialog.value = false
}

// 数据上报
const onReportData = () => {
  console.log(9999)
}
</script>

<style lang="less" scoped>
.data-fill-head {
  position: relative;
  margin-top: 6px;
  padding: 14px 16px;
  background: #ffffff;
  box-shadow: 0px 4px 6px 0px rgba(33, 63, 98, 0.17);
  border-radius: 4px;

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
      align-items: center;
      padding: 0 21px;
      margin-right: 4px;
      height: 32px;
      font-size: 14px;
      color: #000;
      background: #f0f2f7;
      border-radius: 10px 10px 0px 0px;
      cursor: pointer;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }
  }
}

.user-info {
  min-height: 88px;
  margin-top: 14px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e8eaf0;

  .base {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 16px;
    border-bottom: 2px dashed #dcdfe6;
    .user {
      display: flex;
      align-items: center;
    }
    .status {
      display: flex;
      align-items: center;
      padding: 0 13px 0 10px;
      height: 24px;
      font-size: 12px;
      color: #ff2d2d;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid #ff5d5d;

      .point {
        width: 6px;
        height: 6px;
        margin-right: 5px;
        border-radius: 50%;
        background: #ff6767;
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
    align-items: center;
    padding: 0 16px;
    height: 48px;

    .info-item {
      margin-right: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 28px;
      color: #000;
      .txt {
        font-weight: 500;
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
    align-items: center;
    height: 32px;
    padding: 0 16px;
    margin: 14px 8px 0 0;
    font-size: 14px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    .tit {
      margin-left: 6px;
      user-select: none;
    }

    &.active {
      color: var(--el-color-primary);
      background: #e9f0ff;
      border: 1px solid var(--el-color-primary);
    }
  }
}

.data-fill-body {
  margin-top: -10px;
  padding-top: 10px;
  background-color: #fff;
}

.report-dialog {
  .report-cont {
    width: 420px;
    padding: 22px 55px;
    margin: 0 auto;
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    .report-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      .report-tit {
        margin-right: 16px;
        text-align: right;
        color: rgba(19, 19, 19, 0.6);
      }
      .report-txt {
        color: var(--text-color-1);
        font-weight: 500;
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
</style>
