<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">档案管理</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="tips">敬请期待...</div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
</script>

<style lang="less" scoped>
.tips {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  font-size: 30px;
  background-color: #fff;
  border-radius: 5px;
}
</style>
