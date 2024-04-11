<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>
    <div class="line"></div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 资金使用报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        :showOverflowTooltip="true"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
        height="600"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { ElButton } from 'element-plus'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getFundDetailReportListApi, exportFundDetailApi } from '@/api/fundReport/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
const titles = ['智能报表', '资金管理', '概算资金', '资金使用情况']

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
  // {
  //   field: 'code',
  //   label: '代码',
  //   search: {
  //     show: true,
  //     component: 'Input'
  //   },
  //   table: {
  //     show: false
  //   },
  //   form: {
  //     show: false
  //   },
  //   detail: {
  //     show: false
  //   }
  // },
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
    width: 100,
    ...commonTableItemSchema
  },
  {
    field: 'name',
    label: '项目',
    ...commonTableItemSchema
  },
  // {
  //   field: 'code',
  //   label: '代码',
  //   ...commonTableItemSchema
  // },
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  setSearchParams({ ...params })
}

const onReset = () => {
  tableObject.params = {
    projectId
  }
  setSearchParams({})
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params
  }
  const res = await exportFundDetailApi(params)
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}

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

<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  justify-content: space-between;
}

.table-wrap {
  margin-top: 0;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}

.title-hint {
  padding: 15px 0 0 15px;
  font-size: 14px;
  color: 14px;
}

:deep(.el-table .el-table__cell) {
  padding: 5px 0;
}
</style>
