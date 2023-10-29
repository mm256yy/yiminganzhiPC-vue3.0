<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <img class="icon" src="@/assets/imgs/icon_professional.png" alt="" />
        <span class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</span>
        <span class="pl-8px text-size-14px text-[#1C5DF1]">{{ props.baseInfo.code }}</span>
      </div>
      <div> </div>
    </div>

    <div class="other flex-wrap">
      <div class="info-item">
        <div class="tit">地址：</div>
        <div class="txt">{{ props.baseInfo.address || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">权属单位名称：</div>
        <div class="txt">{{ props.baseInfo.underlyingCompany || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">专项类别：</div>
        <div class="txt">{{ props.baseInfo.type || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在地区：</div>
        <div class="txt">{{ props.baseInfo.locationType || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">责任单位：</div>
        <div class="txt">{{ props.baseInfo.responsibilityCompany || '-' }}</div>
      </div>

      <div class="info-item">
        <div class="tit">设计单位：</div>
        <div class="txt">{{ props.baseInfo.designCompany || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">监理单位：</div>
        <div class="txt">{{ props.baseInfo.supervisionCompany || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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

      .icon {
        width: 13px;
        height: 13px;
        margin-right: 6px;
      }
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
