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
        <ElBreadcrumbItem class="text-size-12px">资金入账</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">入账详情</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="table-wrap">
      <div class="common-title">
        <div class="line"></div>
        <div class="tit">入账详情</div>
      </div>
      <div class="row-cont">
        <div class="row">
          <div class="label">资金名称：</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">资金来源：</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">金额(元)：</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">入账时间：</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">说明：</div>
          <div class="value">4444</div>
        </div>

        <div class="row">
          <div class="label">凭证：</div>
          <div class="value">4444</div>
        </div>
      </div>

      <div class="common-title">
        <div class="line"></div>
        <div class="tit">操作详情</div>
      </div>

      <div class="row-cont">
        <div class="row">
          <div class="label">操作人：</div>
          <div class="value">4444</div>
        </div>
        <div class="row">
          <div class="label">操作时间：</div>
          <div class="value">4444</div>
        </div>
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
