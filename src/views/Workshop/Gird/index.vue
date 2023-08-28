<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">基础设置</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">网格管理</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
  </WorkContentWrap>
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
    <div class="report-tabs">
      <div
        :class="['report-tab-item', tabListId === item.id ? 'active' : '']"
        v-for="item in subTabsList"
        :key="item.id"
        @click="onTabList(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
  <div class="data-fill-body">
    <!-- 人口核定 -->
    <Resident v-if="tabCurrentId === 0" ref="vill" />
    <Individuality v-if="tabCurrentId === 1" ref="vill" />
    <Enterprise v-if="tabCurrentId === 2" ref="vill" />
    <VillageCollective v-if="tabCurrentId === 3" ref="vill" />
    <!-- 1 -->
  </div>
</template>

<script setup lang="ts">
// import { reactive } from 'vue'
// import { useAppStore } from '@/store/modules/app'
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import Resident from './GirdData/Resident.vue'
import VillageCollective from './GirdData/VillageCollective.vue'
import Individuality from './GirdData/Individuality.vue'
import Enterprise from './GirdData/Enterprise.vue'
import { WorkContentWrap } from '@/components/ContentWrap'
// const tabsList = ref<any>([])
const tabCurrentId = ref<number>(0)
const tabListId = ref<number>(0)
const vill = ref<any>()
const tabsList = [
  {
    id: 0,
    name: '居民户划分'
  },
  {
    id: 1,
    name: '个体户划分'
  },
  {
    id: 2,
    name: '企业划分'
  },
  {
    id: 3,
    name: '村集体划分'
  }
]
const subTabsList = [
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: '已分配'
  },
  {
    id: 2,
    name: '未分配'
  }
]
const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
  console.log(tabCurrentId.value, '11111')
}
const onTabList = (tabItem) => {
  if (tabListId.value === tabItem.id) {
    return
  }
  tabListId.value = tabItem.id
  console.log(tabCurrentId.value, '123123123')
  vill.value.setAllocationStatus(tabItem.id)
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
      padding: 0 10px;
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

.report-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .report-tab-item {
    display: flex;
    height: 32px;
    padding: 0 16px;
    margin: 14px 8px 0 0;
    font-size: 14px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    align-items: center;

    .tit {
      margin-left: 6px;
      // user-select: none;
    }

    .active-icon {
      margin-left: 6px;
    }

    &.active {
      color: var(--el-color-primary);
      background: #e9f0ff;
      border: 1px solid var(--el-color-primary);
    }
  }
}

.data-fill-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}
</style>
