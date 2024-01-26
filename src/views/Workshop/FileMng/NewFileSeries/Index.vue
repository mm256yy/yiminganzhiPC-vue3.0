<template>
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
    <!--居名户 -->
    <Household v-if="tabCurrentId === 0" />
    <!--企业 -->
    <Enterprise v-if="tabCurrentId === 1" />
    <!--个体户 -->
    <Individual v-if="tabCurrentId === 2" />
    <!--村集体 -->
    <Village v-if="tabCurrentId === 3" />
    <!--专业项目 -->
    <ProfessionalProject v-if="tabCurrentId === 4" />
    <!--只征地不搬迁 -->
    <LandAcquisition v-if="tabCurrentId === 5" />
    <!--报告及批文 -->
    <ReportsApprovals v-if="tabCurrentId === 6" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Household from './components/Household.vue'
import Enterprise from './components/Enterprise.vue'
import Individual from './components/Individual.vue'
import Village from './components/Village.vue'
import ProfessionalProject from './components/ProfessionalProject.vue'
import LandAcquisition from './components/LandAcquisition.vue'
import ReportsApprovals from './components/ReportsApprovals.vue'

const tabCurrentId = ref<number>(0)
const tabsList = [
  {
    id: 0,
    name: '居名户'
  },
  {
    id: 1,
    name: '企业'
  },
  {
    id: 2,
    name: '个体户'
  },
  {
    id: 3,
    name: '村集体'
  },
  {
    id: 4,
    name: '专业项目'
  },
  {
    id: 5,
    name: '只征地不搬迁'
  },
  {
    id: 6,
    name: '报告及批文'
  }
]

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
  sessionStorage.setItem('tabCurrentId', tabCurrentId.value.toString())
}

onMounted(() => {
  const currentTab = sessionStorage.getItem('tabCurrentId')
  if (currentTab) {
    tabCurrentId.value = Number(currentTab)
  }
})
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
