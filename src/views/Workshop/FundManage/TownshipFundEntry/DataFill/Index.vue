<template>
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
      <ElBreadcrumbItem class="text-size-12px"> 资金管理 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">
        {{ type ? getTypeTitle(type) : '乡镇资金发放' }}</ElBreadcrumbItem
      >
    </ElBreadcrumb>
  </div>

  <div class="data-fill-head">
    <div class="head-top">
      <div class="tabs">
        <div
          :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
          v-for="item in tabList"
          :key="item.id"
          @click="onTabClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>

  <div class="data-fill-body">
    <HouseHold v-if="tabCurrentId == 1" :type="tabCurrentId" />
    <Village v-if="tabCurrentId == 2" :type="tabCurrentId" />
    <Other v-if="tabCurrentId == 3" :type="tabCurrentId" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
import HouseHold from './HouseHold/Index.vue'
import Village from './Village/Index.vue'
import Other from './Other/Index.vue'

const { currentRoute, back } = useRouter()
const tabCurrentId = ref<number>(1)
const { type } = currentRoute.value.query as any
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const tabList = ref<any>([
  {
    id: 1,
    name: '居民户'
  },
  {
    id: 2,
    name: '村集体'
  },
  {
    id: 3,
    name: '其他'
  }
])

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
  // chooseType(type)
}

// 获取不同类型标题
const getTypeTitle = (type: number) => {
  const map = {
    0: '居民户',
    1: '村集体',
    2: '其他'
  }

  return map[type]
}

const onBack = () => {
  back()
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
    margin-top: 20px;
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
  min-height: 300px;
  background-color: #fff;
}
</style>
