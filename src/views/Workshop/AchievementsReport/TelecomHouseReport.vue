<template>
  <WorkContentWrap>
    <!-- 电信工程房屋及其附属物设备汇总表 -->
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">电信工程</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 电信工程房屋及其附属物设备汇总表 </div>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn type="index" label="序号" align="center" />
        <ElTableColumn prop="project" label="项目名称" show-overflow-tooltip align="center" />
        <ElTableColumn prop="doorMaster" label="单位" show-overflow-tooltip align="center" />
        <ElTableColumn prop="region" label="数量" show-overflow-tooltip align="center" />
      </ElTable>
      <!-- <img src="@/assets/imgs/report/telegraphy_tenement.png" alt="电信房屋及附属物表" /> -->
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'

import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ref, reactive } from 'vue'

import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()
const tableData = ref<any>([])

const BackIcon = useIcon({ icon: 'iconoir:undo' })

const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'qy',
    label: '区域',
    search: {
      show: true,
      component: 'Select'
    },
    table: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户号',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },

  {
    field: 'name',
    label: '姓名',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])
const { allSchemas } = useCrudSchemas(schema)
const onBack = () => {
  back()
}
</script>

<style scoped></style>
