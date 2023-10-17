<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金使用情况</ElBreadcrumbItem>
    </ElBreadcrumb>
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
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
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
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getFundDetailReportListApi } from '@/api/fundReport/service'

// interface SpanMethodProps {
//   row: any
//   column: any
//   rowIndex: number
//   columnIndex: number
// }

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { register, tableObject, methods } = useTable({
  getListApi: getFundDetailReportListApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

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
    type: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '项目',
    fixed: true,
    ...commonTableItemSchema
  },
  {
    field: 'code',
    label: '代码',
    ...commonTableItemSchema
  },
  {
    field: '1',
    label: '概算投资(元)',
    ...commonTableItemSchema
  },
  {
    field: '2',
    label: '调估投资(元)',
    ...commonTableItemSchema
  },
  {
    field: '3',
    label: '调概投资(元)',
    ...commonTableItemSchema
  },
  {
    label: '使用资金',
    children: [
      {
        field: '4',
        label: '概算内金额(元)',
        ...commonTableItemSchema
      },
      {
        field: '5',
        label: '概算外金额(元)',
        ...commonTableItemSchema
      }
    ],
    ...commonTableItemSchema
  },
  {
    field: '6',
    label: '备注',
    ...commonTableItemSchema
  }
])

const { allSchemas } = useCrudSchemas(schema)

// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
//   console.log(column)
//   if (columnIndex === 0) {
//     // 如果与上一个分组名称相同，被合并
//     if (rowIndex !== 0 && row.type === tableObject.tableList[rowIndex - 1].type) {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//     // 统计新的分组所占行数
//     let index = rowIndex + 1
//     let rowspan = 1
//     while (index < tableObject.tableList.length) {
//       if (row.type === tableObject.tableList[index].type) {
//         rowspan++
//         index++
//       } else {
//         break
//       }
//     }
//     return {
//       rowspan: rowspan,
//       colspan: 1
//     }
//   }
// }

/**
 * 获取金额类型
 * @param type 类型 1 补偿, 2 补助, 3 奖励, 4 其他
 */
// const getTypeStr = (type: string) => {
//   switch (type) {
//     case '1':
//       return '补偿费'
//       break
//     case '2':
//       return '补助费'
//       break
//     case '3':
//       return '奖励费'
//       break
//     case '4':
//       return '其他费用'
//       break
//     default:
//       return ''
//   }
// }
</script>
