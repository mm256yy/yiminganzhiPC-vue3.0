<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 移民资金使用情况报表 </div>
        <div></div>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getFundDetailReportListApi } from '@/api/fundReport/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
const titles = ['智能报表', '资金管理', '资金使用情况']

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { register, tableObject } = useTable()

tableObject.params = {
  projectId
}

const commonTableItemSchema = {
  search: {
    show: false
  },
  form: {
    show: false
  },
  detail: {
    show: false
  }
}
const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
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
    label: '项目',
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

  // table 字段定义
  {
    field: 'serNoStr',
    label: '序号',
    ...commonTableItemSchema
  },
  {
    field: 'name',
    label: '项目',
    ...commonTableItemSchema
  },
  {
    field: 'code',
    label: '代码',
    ...commonTableItemSchema
  },
  {
    field: 'gsInvest',
    label: '概算投资(元)',
    ...commonTableItemSchema
  },
  {
    field: 'guInvest',
    label: '调估投资(元)',
    ...commonTableItemSchema
  },
  {
    field: 'gaiInvest',
    label: '调概投资(元)',
    ...commonTableItemSchema
  },
  {
    label: '使用资金',
    children: [
      {
        field: 'amount',
        label: '金额(元)',
        ...commonTableItemSchema
      },
      {
        field: 'apr',
        label: '实际/概算(%)',
        ...commonTableItemSchema
      }
    ],
    ...commonTableItemSchema
  }
])

const { allSchemas } = useCrudSchemas(schema)

const getTableList = async (params?: any) => {
  tableObject.loading = true
  const res = await getFundDetailReportListApi({
    projectId: projectId,
    ...params
  }).finally(() => {
    tableObject.loading = false
  })
  if (res) {
    // 赋值表格数据
    tableObject.tableList = res || []
  }
}

// 搜索
const setSearchParams = (data: any) => {
  getTableList(data)
}

getTableList()
</script>
