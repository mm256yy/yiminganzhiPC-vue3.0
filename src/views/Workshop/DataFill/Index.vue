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
        <ElButton type="primary" :icon="EscalationIcon">数据上报</ElButton>
      </div>

      <div class="user-info">
        <div class="base">
          <div class="user">
            <Icon icon="mdi:user-circle" color="#3E73EC" />
            <span class="pl-12px text-size-16px text-[#000]">{{ baseInfo.name }}</span>
            <span class="pl-8px text-size-14px text-[#000]">{{ baseInfo.doorNo }}</span>
          </div>
          <div class="status"><span class="point"></span>未填报</div>
        </div>

        <div class="other">
          <div class="info-item">
            <div class="tit">行政村名称：</div>
            <div class="txt">{{ baseInfo.villageText }}</div>
          </div>
          <div class="info-item">
            <div class="tit">自然村名称：</div>
            <div class="txt">{{ baseInfo.virutalVillageText }}</div>
          </div>
          <div class="info-item">
            <div class="tit">所在位置：</div>
            <div class="txt">{{ baseInfo.address }}</div>
          </div>
          <div class="info-item">
            <div class="tit">联系电话：</div>
            <div class="txt">{{ baseInfo.phone }}</div>
          </div>
          <div class="info-item">
            <div class="tit">家庭人数：</div>
            <div class="txt">{{ baseInfo.count }}</div>
          </div>
        </div>
      </div>

      <div class="report-tabs">
        <div class="report-tab-item" v-for="item in ReportTabs" :key="item.id">
          <Icon :icon="item.icon" color="#3E73EC" />
          <div class="tit">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="data-fill-body">
      <!-- <Demographic /> -->
      <!-- <House /> -->
      <!-- <Accessory /> -->
      <!-- <Fruitwood /> -->
      <!-- <Grave /> -->
      <!-- <Enclosure /> -->
      <FamilyIncome />
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import { ReportTabs } from './config'
import { getDemographicByIdApi } from '@/api/project/population/service'
import Demographic from './Demographic/Index.vue'
import House from './House/Index.vue'
import Accessory from './Accessory/Index.vue'
import Fruitwood from './Fruitwood/Index.vue'
import Grave from './Grave/Index.vue'
import Enclosure from './Enclosure/Index.vue'
import FamilyIncome from './FamilyIncome/Index.vue'

const baseInfo = ref({})
const EscalationIcon = useIcon({
  icon: 'carbon:send-alt'
})

const UserIcon = useIcon({
  icon: '',
  color: ''
})

// doorNo
// 006009359
// id 13148
const getDemographicInfo = () => {
  getDemographicByIdApi(13148).then((res) => {
    baseInfo.value = res
  })
}

getDemographicInfo()
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
    }
  }
}

.data-fill-body {
  margin-top: -10px;
  padding-top: 10px;
  background-color: #fff;
}
</style>
