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
      <ElBreadcrumbItem class="text-size-12px"> 档案管理 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px"> 报告及批文 </ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>

  <div class="data-fill-head">
    <div class="head-top">
      <div class="tabs">
        <div
          :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
          v-for="item in reportApprovalTabs"
          :key="item.id"
          @click="onTabClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>

  <div class="data-fill-body">
    <ReportItem :list="getList()" @jump="routerJump" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { reportApprovalTabs } from '../DataFill/config'
import ReportItem from '../DataFill/components/ReportItem/Index.vue'
import { reportList, otherReportList } from '../DataFill/config'
import { getReportNumber } from '@/api/home'

const { push, back } = useRouter()
const tabCurrentId = ref<number>(1)
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const reportData = ref<any>([]) // 报告列表

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}

const getList = () => {
  const list = tabCurrentId.value === 1 ? reportList : otherReportList
  return list
}

// 路由跳转
const routerJump = (path: string) => {
  push(path)
}

// 初始化获取报告展示数据（报告是否上传及个数）
const initReportData = () => {
  getReportNumber().then((res: any) => {
    reportData.value = res
    getReportResult()
    getOtherReportList()
  })
}

/**
 * 报告归集是否有报告
 */
const getReportResult = () => {
  for (let i = 0; i < reportData.value.length; i++) {
    for (let j = 0; j < reportList.length; j++) {
      if (reportList[j].type === reportData.value[i].type) {
        reportList[j].checked = reportData.value[i].number > 0
      } else {
        reportList[j].checked = false
      }
    }
  }
}

/**
 * 其他报告是否有报告
 */
const getOtherReportList = () => {
  for (let i = 0; i < reportData.value.length; i++) {
    for (let j = 0; j < otherReportList.length; j++) {
      if (otherReportList[j].type === reportData.value[i].type) {
        otherReportList[j].checked = reportData.value[i].number > 0
      } else {
        otherReportList[j].checked = false
      }
    }
  }
}

onMounted(() => {
  initReportData()
})

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
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}
</style>
