<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="data-fill-head">
      <div class="head-top">
        <div class="tabs">
          <div
            :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
            v-for="item in tabsList"
            :key="item.id"
            @click="onTabClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="data-fill-body">
      <!-- 按户查询 -->
      <Query v-if="tabCurrentId === 1" />

      <!-- 区域报表 -->
      <Region v-else />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Query from './Query.vue' // 按户查询
import Region from './Region.vue' // 区域报表
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'

const tabCurrentId = ref<number>(1)
const tabsList = [
  {
    id: 1,
    name: '按户查询'
  },
  {
    id: 2,
    name: '区域报表'
  }
]
const titles = ['智能报表', '实物成果', '居民户', '零星林(果)木']

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}
</script>
<style lang="less" scoped>
.data-fill-head {
  position: relative;
  padding: 14px 16px;
  margin-top: 6px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(33, 63, 98, 0.17);

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
      height: 32px;
      padding: 0 20px;
      margin-right: 4px;
      font-size: 14px;
      color: #000;
      cursor: pointer;
      background: #f0f2f7;
      border-radius: 10px 10px 0px 0px;
      align-items: center;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }
  }
}

.data-fill-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}
</style>
