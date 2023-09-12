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
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金支付</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金支付详情</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="table-wrap">
      <div class="common-title">
        <div class="line"></div>
        <div class="tit">入账详情</div>
      </div>
      <div class="row-cont">
        <div class="row">
          <div class="label">申请类型：</div>
          <div class="value">工程回款</div>
        </div>

        <div class="row">
          <div class="label">申请名称：</div>
          <div class="value">感觉沙拉酱拉升</div>
        </div>
        <div class="row">
          <div class="label">概算科目：</div>
          <div class="value">城市美化</div>
        </div>
        <div class="row">
          <div class="label">资金科目：</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">付款说明:</div>
          <div class="value">范德萨发撒发生发大发的是谁</div>
        </div>

        <div class="row">
          <div class="label">申请时间:</div>
          <div class="value">2023-10-23 08:00:00</div>
        </div>

        <div class="row">
          <div class="label">申请人:</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">收款单位:</div>
          <div class="value">的房间里睡觉啊了解了封疆大吏睡觉啊</div>
        </div>

        <div class="row">
          <div class="label">付款时间:</div>
          <div class="value">2023-10-23 08:00:00</div>
        </div>

        <div class="row">
          <div class="label">申请金额:</div>
          <div class="value">4453355</div>
        </div>

        <div class="row">
          <div class="label">申请凭证:</div>
          <div class="value">粉底刷卡即将离开房间里都是</div>
        </div>
      </div>

      <div class="common-title">
        <div class="line"></div>
        <div class="tit">操作详情</div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
// import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
// import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'

const { back } = useRouter()
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const onBack = () => {
  back()
}
</script>

<style scoped lang="less">
.row-cont {
  padding: 0 28px;
}

.row {
  display: flex;
  align-items: center;
  min-height: 64px;

  border-bottom: 1px solid #ebebeb;

  .label {
    width: 98px;
    font-size: 14px;
    color: #131313;
    text-align: right;
  }

  .value {
    flex: 1;
    padding-left: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #171718;
  }
}

.common-title {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  background: #f5f7fa;
  border: 1px solid #ebebeb;

  .line {
    width: 4px;
    height: 16px;
    margin-right: 8px;
    background: linear-gradient(90deg, #3e73ec 0%, #ffffff 100%);
    border-radius: 3px;
  }

  .tit {
    font-size: 14px;
    font-weight: 500;
    color: #131313;
  }
}
</style>
