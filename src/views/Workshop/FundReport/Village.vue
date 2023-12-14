<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="tips">敬请期待...</div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
const titles = ['智能报表', '资金管理', '村集体']
</script>

<style lang="less" scoped>
.tips {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  margin-top: 10px;
  font-size: 30px;
  background-color: #fff;
  border-radius: 5px;
}
</style>
