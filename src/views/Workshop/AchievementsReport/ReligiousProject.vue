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
      <ElBreadcrumbItem class="text-size-12px"> 智慧报表 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px"> 实物成果 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px"> 专业项目 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px"> 宗教 </ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>

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
    <!-- 设施汇总 -->
    <ReligiousInformation v-if="tabCurrentId === 1" />

    <!-- 房屋及其附属物设备汇总 -->
    <ReligiousAppendage v-else />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import ReligiousInformation from './ReligiousInformation.vue' // 设施汇总
import ReligiousAppendage from './ReligiousAppendage.vue' // 房屋及其附属物设备汇总
import { useRouter } from 'vue-router'

const { back } = useRouter()
const tabCurrentId = ref<number>(1)
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const tabsList = [
  {
    id: 1,
    name: '设施汇总'
  },
  {
    id: 2,
    name: '房屋及其附属物设备汇总'
  }
]

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
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
