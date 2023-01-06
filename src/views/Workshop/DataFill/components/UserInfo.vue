<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <Icon icon="mdi:user-circle" color="#3E73EC" />
        <span class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</span>
        <span class="pl-8px text-size-14px text-[#000]">{{ props.baseInfo.doorNo }}</span>
      </div>
      <div :class="{ status: true, success: props.baseInfo.status === ReportStatus.ReportSucceed }"
        ><span class="point"></span
        >{{ props.baseInfo.status === ReportStatus.ReportSucceed ? '已填报' : '未填报' }}</div
      >
    </div>

    <div class="other">
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
        <div class="txt">{{ props.baseInfo.address || '-' }}</div>
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
  </div>
</template>

<script lang="ts" setup>
import { ReportStatus } from '../config'

interface PropsType {
  baseInfo: any
}

const props = defineProps<PropsType>()
</script>

<style lang="less" scoped>
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
</style>
