<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <Icon icon="mdi:user-circle" color="#3E73EC" />
        <span class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</span>
        <span class="pl-8px text-size-14px text-[#1C5DF1]">{{ props.baseInfo.doorNo }}</span>
      </div>
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
    <div class="other" v-if="type == 'Enterprise'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.virutalVillageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.address || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">法人：</div>
        <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
      </div>
    </div>

    <div class="other" v-if="type == 'IndividualB'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.virutalVillageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.address || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">法人：</div>
        <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
      </div>
    </div>

    <div class="other" v-if="type == 'villageInfoC'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.virutalVillageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.address || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">联系方式：</div>
        <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ReportStatus } from '../config'

interface PropsType {
  baseInfo: any
  type: any
}

const props = defineProps<PropsType>()
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
