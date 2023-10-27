<template>
  <div class="flex items-center">
    <!-- <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton> -->
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">专业项目</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">交通/电力/移动联通铁塔电信/文物</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="setSearchParams"
      />
      <!-- <ElButton type="primary" @click="onExport"> 数据导出 </ElButton> -->
    </div>

    <div class="line"></div>

    <div class="table-wrap" v-loading="tableObject.loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 交通/电力/移动联通铁塔电信/文物 </div>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        @register="register"
      >
        <template #agreementStatus="{ row }">
          <div v-if="row.agreementStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.agreementStatus == '0'"></div>
        </template>
        <template #startStatus="{ row }">
          <div v-if="row.startStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.startStatus == '0'"></div>
        </template>
        <template #checkStatus="{ row }">
          <div v-if="row.checkStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.checkStatus == '0'"></div>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

import { ComprehensiveReportType } from '@/api/workshop/comprehensive/types'
import { getComprehensiveReportApi } from '@/api/workshop/comprehensive/service'

import { screeningTree } from '@/api/workshop/village/service'
import { exportTypes } from '../DataQuery/DataCollectionPublicity/config'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

interface SpanMethodProps {
  row: ComprehensiveReportType
  column: ComprehensiveReportType
  rowIndex: number
  columnIndex: number
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const { register, tableObject, methods } = useTable({
  getListApi: getComprehensiveReportApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCode',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: villageTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: false,
        checkStrictly: false,
        checkOnClickNode: false
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'id',
    label: '户号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '户主姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户主姓名'
      }
    },
    table: {
      show: false
    }
  },

  // table字段 分割
  {
    field: 'id',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '项目名称',
    search: {
      show: false
    }
  },
  {
    field: 'code',
    label: '专项编码',
    search: {
      show: false
    }
  },
  {
    field: 'type',
    label: '专项类别',
    search: {
      show: false
    }
  },
  {
    field: 'responsibilityCompany',
    label: '责任单位',
    search: {
      show: false
    }
  },
  {
    field: 'designCompany',
    label: '设计单位',
    search: {
      show: false
    }
  },
  {
    field: 'supervisionCompany',
    label: '监理单位',
    search: {
      show: false
    }
  },
  {
    field: 'agreementStatus',
    label: '协议签订',
    search: {
      show: false
    }
  },
  {
    field: 'startStatus',
    label: '开工',
    search: {
      show: false
    }
  },
  {
    field: 'checkStatus',
    label: '验收',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

/**
 * 合并单元行
 * @param{Object} row 当前行
 * @param{Object} column 当前列
 * @param{Object} rowIndex 当前行下标
 * @param{Object} columnInex 当前列下标
 */
// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
//   const num = tableObject.tableList.filter(
//     (item: any) => item.householdName === row.householdName && item.doorNo === row.doorNo
//   ).length
//   const index = tableObject.tableList.findIndex(
//     (item: any) => item.householdName === row.householdName && item.doorNo === row.doorNo
//   )
//   if (column && columnIndex < 1) {
//     if (index === rowIndex) {
//       return {
//         rowspan: num,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   }
// }

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  if (!params.householdName) {
    delete params.householdName
  }
  if (!params.doorNo) {
    delete params.doorNo
  }
  if (params.villageCode) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.villageCode, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.villageCode
      }
      setSearchParams({ ...params })
    })
  } else {
    delete params.villageCode
    setSearchParams({ ...params })
  }
}

// 数据导出
const onExport = () => {
  emit('export', villageTree.value, exportTypes.house)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

// 递归查找
const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}
const onBack = () => {
  back()
}
onMounted(() => {
  getVillageTree()
  setSearchParams({})
})
// 在useTable之后定义一个watcher
// watch(
//   [() => tableObject.tableList, () => tableObject],
//   ([newTableList, newTableObject], [oldTableList, oldTableObject]) => {
//     // 检查tableList是否有新的数据
//     if (newTableList !== oldTableList) {
//       console.log('tableList数据已更新', newTableList, oldTableList)
//     }
//     // 检查tableObject是否有新的数据
//     if (newTableObject !== oldTableObject) {
//       console.log('tableObject数据已更新')
//     }
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// )
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
</style>
