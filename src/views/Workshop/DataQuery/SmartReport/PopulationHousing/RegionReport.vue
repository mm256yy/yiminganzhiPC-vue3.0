<!--区域报表-->
<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
      <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
    </div>

    <div class="line"></div>
    <div class="title-hint">人口房屋统计表（区域报表）</div>
    <div class="table-wrap">
      <Table
        ref="tableRef"
        v-loading="tableLoading"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        height="460"
        :max-height="460"
        style="width: 100%"
        row-key="id"
        show-summary
        headerAlign="center"
        align="center"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getAreaHouseReportApi,
  exportReportApi
} from '@/api/workshop/dataQuery/populationHousing-service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const districtTree = ref<any[]>([])

const villageTree = ref<any[]>([])
const code = ref<any>(null)
const tableLoading = ref<boolean>()
let schemas = reactive<any>({
  columns: []
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
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
  }
])

const { allSchemas } = useCrudSchemas(schema)

const requestListApi = async () => {
  const params = {
    projectId,
    villageCode: code.value
  }
  tableLoading.value = true
  try {
    let result: any = await getAreaHouseReportApi(params)
    getTableDepends(result.titles, result.data)
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
}

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

const getTableDepends = (titles: any[], list: any[]) => {
  const title1 = titles.slice(2, 5)
  const title2 = titles.slice(5)

  let columns: any = [
    {
      width: 80,
      field: '0',
      type: 'index',
      label: '序号'
    },
    {
      field: '1',
      label: '区域名'
    },
    {
      label: '人口（人）',
      children: [],
      ...commonTableItemSchema
    },
    {
      label: '房屋建筑面积（m2)',
      children: [],
      ...commonTableItemSchema
    }
  ]

  title1.forEach((item: any, index: any) => {
    columns[2].children.push({
      label: item,
      field: `${index + 2}`,
      ...commonTableItemSchema
    })
  })

  title2.forEach((item: any, index: any) => {
    columns[3].children.push({
      label: item,
      field: `${index + 5}`,
      ...commonTableItemSchema
    })
  })

  let allData = useCrudSchemas(columns)
  schemas.columns = allData.allSchemas.tableColumns
  tableObject.tableList = list.reduce((pre, iem) => {
    pre.push({ ...iem })
    return pre
  }, [])
}

const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = '合计'
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return (prev + curr).toFixed(2)
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  code.value = params.code
  requestListApi()
}

const onReset = () => {
  code.value = null
  requestListApi()
}

// 数据导出
const onExport = async () => {
  const params = {
    exportType: '2',
    projectId,
    villageCode: code.value
  }
  const res = await exportReportApi(params)
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

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

onMounted(() => {
  getVillageTree()
  getdistrictTree()
  requestListApi()
})
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
  color: 14px;
}
</style>
