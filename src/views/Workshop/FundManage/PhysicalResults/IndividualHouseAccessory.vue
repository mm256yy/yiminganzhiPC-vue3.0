<!--房屋及附属物统计表-->
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
    <div class="table-wrap" v-loading="tableLoading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title">房屋及附属物 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        :showOverflowTooltip="true"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        height="600"
        :summary-method="getSummaries"
        show-summary
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useAppStore } from '@/store/modules/app'
import {
  requestIndividualHouseholdTree,
  exportIndividualHouseholdTree
} from '@/api/fundManage/fundPayment-service'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'

const appStore = useAppStore()
const districtTree = ref<any[]>([])
const titles = ['智能报表', '实物成果', '个体户', '房屋及附属物']
let tableRef = ref()
const tableLoading = ref<boolean>(false)
const projectId = appStore.currentProjectId
let searchParams = reactive({})

let schemas = reactive<any>({
  columns: []
})
const getDistrictTree = async () => {
  const list = await screeningTree(projectId, 'IndividualHousehold')
  districtTree.value = list || []
  return list || []
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCodeVal',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: districtTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '个体工商户编号',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: '个体工商户名称',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

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

// 合计
const getSummaries = (params: any) => {
  const { columns, data } = params
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (index < 3) {
      sums[index] = ''
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    }
  })

  return sums
}

// 获取附属物数据
const requestIndividualHouseAccessory = async () => {
  let column: any = [
    {
      width: 80,
      field: '0',
      label: '序号'
    },
    {
      field: '1',
      label: '行政村'
    },
    {
      field: '2',
      label: '个体户编号'
    },
    {
      field: '3',
      label: '个体工商户名称'
    },
    {
      label: '房屋面积（㎡）',
      children: [],
      ...commonTableItemSchema
    },
    {
      label: '附属物',
      children: [],
      ...commonTableItemSchema
    }
  ]

  tableLoading.value = true

  const params = {
    ...searchParams
  }
  try {
    const result: any = await requestIndividualHouseholdTree(params)
    result.houseTitleArr.forEach((item: any, index: any) => {
      column[4].children.push({
        label: item,
        field: `${index + 4}`,
        ...commonTableItemSchema
      })
    })
    result.appendageTitleArr.forEach((item: any, index: any) => {
      column[5].children.push({
        label: item,
        field: `${index + 4 + result.houseTitleArr.length}`,
        ...commonTableItemSchema
      })
    })
    let allData = useCrudSchemas(column)
    schemas.columns = allData.allSchemas.tableColumns
    tableObject.tableList = result.data
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

const onSearch = (data) => {
  // 处理参数
  searchParams = {
    ...data
  }

  requestIndividualHouseAccessory()
}

const onReset = () => {
  searchParams = {}
  requestIndividualHouseAccessory()
}

const onExport = async () => {
  const params = {}
  const res = await exportIndividualHouseholdTree(params)
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

onMounted(() => {
  getDistrictTree()
  requestIndividualHouseAccessory()
})
</script>

<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  align-items: center;
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
  padding: 0 0 15px 0;
  font-size: 14px;
  color: 14px;
}

:deep(.el-table .el-table__cell) {
  padding: 5px 0;
}
</style>
