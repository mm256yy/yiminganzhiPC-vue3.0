<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> {{ titles }}</div>
        <div></div>
      </div>
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="allSchemas.columns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        highlightCurrentRow
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getEnterpriseAppendant,
  getEnterpriseTree,
  getIndividualHouseholdAppendant,
  getIndividualHouseholdTree
} from '@/api/fundManage/fundPayment-service'
import { useRoute } from 'vue-router'
let Route = useRoute()
// interface SpanMethodProps {
//   row: any
//   column: any
//   rowIndex: number
//   columnIndex: number
// }
let tableRef = ref()
const appStore = useAppStore()
let allSchemas = reactive<any>({
  columns: []
})
const projectId = appStore.currentProjectId
let tableObject = reactive({
  tableList: []
})
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
let titles = ref('')
// const schema = reactive<CrudSchema[]>([
//   // 搜索字段定义

//   // table 字段定义
//   {
//     field: 'name',
//     label: '户主',
//     fixed: true,
//     ...commonTableItemSchema
//   },
//   {
//     label: '补偿费',
//     children: [
//       {
//         label: '房屋结构补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '11',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '111',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '房屋装修补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '22',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '222',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '附属物补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '33',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '333',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '零星果木补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '44',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '444',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '土地补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '55',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '555',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '建设用地补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '66',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '666',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '基础设施补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '77',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '777',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '设施设备搬迁损失补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '88',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '888',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '固定设施设备补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '99',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '999',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '停产损失补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '100',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '1000',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '矿业权补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '111',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '1111',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '水电站补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '122',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '1222',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '其他补偿费',
//         children: [
//           {
//             label: '已发',
//             field: '133',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '1333',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       }
//     ],
//     ...commonTableItemSchema
//   },
//   {
//     label: '补助费',
//     children: [
//       {
//         label: '搬迁补助费',
//         children: [
//           {
//             label: '已发',
//             field: '11',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '111',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '其他补助费',
//         children: [
//           {
//             label: '已发',
//             field: '22',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '222',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       }
//     ],
//     ...commonTableItemSchema
//   },
//   {
//     label: '奖励费',
//     children: [
//       {
//         label: '签约奖',
//         children: [
//           {
//             label: '已发',
//             field: '11',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '111',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '腾空奖',
//         children: [
//           {
//             label: '已发',
//             field: '22',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '222',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       },
//       {
//         label: '其他奖励费',
//         children: [
//           {
//             label: '已发',
//             field: '22',
//             ...commonTableItemSchema
//           },
//           {
//             label: '应发',
//             field: '222',
//             ...commonTableItemSchema
//           }
//         ],
//         ...commonTableItemSchema
//       }
//     ],
//     ...commonTableItemSchema
//   }
// ])

// const { allSchemas } = useCrudSchemas(schema)
onMounted(() => {
  let id = Route.query.id
  console.log(id)

  if (id == '2') {
    document.title = '企业房屋及其附属物汇总表序号 行政村（公示表）'
    titles.value = '企业房屋及其附属物汇总表序号 行政村（公示表）'
    getEnterpriseAppendants(getEnterpriseAppendant())
  } else if (id == '3') {
    document.title = '企业零星林（果）木汇总表序号 行政村（公示表）'
    titles.value = '企业零星林（果）木汇总表序号 行政村（公示表）'
    getEnterpriseTrees(getEnterpriseTree())
  } else if (id == '5') {
    document.title = '个体户零星林（果）木汇总表序号 行政村（公示表）'
    titles.value = '个体户零星林（果）木汇总表序号 行政村（公示表）'
    getEnterpriseTrees(getIndividualHouseholdTree())
  }
})
let getEnterpriseAppendants = async (e) => {
  //附属物接口处理
  let data: any = await e
  let clome: any = [
    {
      width: 80,
      field: 'index',
      type: 'index',
      label: '序号'
    },
    {
      field: '0',
      label: '行政村',
      ...commonTableItemSchema
    },
    {
      field: '1',
      label: '名称',
      ...commonTableItemSchema
    },
    // {
    //   field: '2',
    //   label: '户号',
    //   ...commonTableItemSchema
    // },
    {
      label: '房屋面积',
      children: [],
      ...commonTableItemSchema
    },
    {
      label: '附属物',
      children: [],
      ...commonTableItemSchema
    }
  ]
  data.titles.forEach((item: any, index: any) => {
    if (data.houseTitles.includes(item)) {
      clome[3].children.push({
        label: item,
        field: `${index}`,
        ...commonTableItemSchema
      })
    } else if (data.appendantTitles.includes(item)) {
      clome[4].children.push({
        label: item,
        field: `${index}`,
        ...commonTableItemSchema
      })
    }
  })
  let allData = useCrudSchemas(clome)
  allSchemas.columns = allData.allSchemas.tableColumns
  console.log(allSchemas.columns, projectId)
  tableObject.tableList = data.list.reduce((pre, iem) => {
    pre.push({ ...iem })
    return pre
  }, [])
}
let getEnterpriseTrees = async (e) => {
  let data: any = await e
  let clome: any = [
    {
      width: 80,
      field: 'index',
      type: 'index',
      label: '序号'
    },
    {
      field: '0',
      label: '行政村',
      ...commonTableItemSchema
    },
    {
      field: '1',
      label: '名称',
      ...commonTableItemSchema
    },
    // {
    //   field: '2',
    //   label: '户号',
    //   ...commonTableItemSchema
    // },
    {
      label: '零星果木',
      children: [],
      ...commonTableItemSchema
    }
  ]
  data.titles.forEach((item: any, index: any) => {
    if (data.usageTitles.includes(item)) {
      clome[3].children.push({
        label: item,
        field: `${index}`,
        ...commonTableItemSchema
      })
    }
  })
  let allData = useCrudSchemas(clome)
  allSchemas.columns = allData.allSchemas.tableColumns
  console.log(allSchemas.columns, projectId)
  tableObject.tableList = data.list.reduce((pre, iem) => {
    pre.push({ ...iem })
    return pre
  }, [])
}
</script>
