<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">居民信息采集</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">数据填报</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="data-fill-head"></div>
    <div class="data-fill-body"></div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
</script>

<style lang="less" scoped>
.data-fill-head {
  width: 1408px;
  height: 209px;
  padding: 14px 16px;
  background: #ffffff;
  box-shadow: 0px 4px 6px 0px rgba(33, 63, 98, 0.17);
  border-radius: 4px;
}
</style>
