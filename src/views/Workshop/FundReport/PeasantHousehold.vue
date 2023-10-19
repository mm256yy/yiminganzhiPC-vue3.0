<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">居民户</ElBreadcrumbItem>
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
        <div class="table-left-title"> 居民户报表 </div>
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
import { getHouseholdReportListApi } from '@/api/fundReport/service'

// interface SpanMethodProps {
//   row: any
//   column: any
//   rowIndex: number
//   columnIndex: number
// }

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { register, tableObject, methods } = useTable({
  getListApi: getHouseholdReportListApi
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
    label: '名称',
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
    field: 'name',
    label: '户主',
    fixed: true,
    ...commonTableItemSchema
  },
  {
    label: '补偿费',
    children: [
      {
        label: '房屋结构补偿费',
        children: [
          {
            label: '已发',
            field: '11',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '111',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '房屋装修补偿费',
        children: [
          {
            label: '已发',
            field: '22',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '222',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '附属物补偿费',
        children: [
          {
            label: '已发',
            field: '33',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '333',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '零星果木补偿费',
        children: [
          {
            label: '已发',
            field: '44',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '444',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '土地补偿费',
        children: [
          {
            label: '已发',
            field: '55',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '555',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '建设用地补偿费',
        children: [
          {
            label: '已发',
            field: '66',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '666',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '基础设施补偿费',
        children: [
          {
            label: '已发',
            field: '77',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '777',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '设施设备搬迁损失补偿费',
        children: [
          {
            label: '已发',
            field: '88',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '888',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '固定设施设备补偿费',
        children: [
          {
            label: '已发',
            field: '99',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '999',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '停产损失补偿费',
        children: [
          {
            label: '已发',
            field: '100',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '1000',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '矿业权补偿费',
        children: [
          {
            label: '已发',
            field: '111',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '1111',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '水电站补偿费',
        children: [
          {
            label: '已发',
            field: '122',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '1222',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '其他补偿费',
        children: [
          {
            label: '已发',
            field: '133',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '1333',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      }
    ],
    ...commonTableItemSchema
  },
  {
    label: '补助费',
    children: [
      {
        label: '搬迁补助费',
        children: [
          {
            label: '已发',
            field: '11',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '111',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '其他补助费',
        children: [
          {
            label: '已发',
            field: '22',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '222',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      }
    ],
    ...commonTableItemSchema
  },
  {
    label: '奖励费',
    children: [
      {
        label: '签约奖',
        children: [
          {
            label: '已发',
            field: '11',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '111',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '腾空奖',
        children: [
          {
            label: '已发',
            field: '22',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '222',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      },
      {
        label: '其他奖励费',
        children: [
          {
            label: '已发',
            field: '22',
            ...commonTableItemSchema
          },
          {
            label: '应发',
            field: '222',
            ...commonTableItemSchema
          }
        ],
        ...commonTableItemSchema
      }
    ],
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
