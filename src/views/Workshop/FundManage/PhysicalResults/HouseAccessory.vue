<template>
  <WorkContentWrap>
    <div class="search-wrap">
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
        <div class="table-left-title">房屋及其附属物统计表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        highlightCurrentRow
        height="600"
        style="width: 100%; max-height: 600px"
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { ElButton } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getEnterpriseAppendant,
  exportHouseAttachments
} from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'

const districtTree = ref<any[]>([])
let tableRef = ref()
const tableLoading = ref<boolean>(false)
const appStore = useAppStore()
const projectId = appStore.currentProjectId
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
  },
  {
    field: 'name',
    label: '企业名称',
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

const { register, tableObject } = useTable()

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

// 获取附属物数据
const requestHouseAccessory = async () => {
  let column: any = [
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

  tableLoading.value = true

  try {
    const result: any = await getEnterpriseAppendant(tableObject.params)
    result.titles.forEach((item: any, index: any) => {
      if (result.houseTitles.includes(item)) {
        column[3].children.push({
          label: item,
          field: `${index}`,
          ...commonTableItemSchema
        })
      } else if (result.appendantTitles.includes(item)) {
        column[4].children.push({
          label: item,
          field: `${index}`,
          ...commonTableItemSchema
        })
      }
    })
    let allData = useCrudSchemas(column)
    schemas.columns = allData.allSchemas.tableColumns
    tableObject.tableList = result.list.reduce((pre, iem) => {
      pre.push({ ...iem })
      return pre
    }, [])
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}
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

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}
const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  if (params.code) {
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
    })
    delete params.code
  }
  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  tableObject.params = {
    ...params
  }

  requestHouseAccessory()
}

const onReset = () => {
  tableObject.params = {}
  requestHouseAccessory()
}

const onExport = async () => {
  const params = {
    type: 'Company',
    ...tableObject.params
  }
  const res = await exportHouseAttachments(params)
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

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

onMounted(() => {
  getdistrictTree()
  requestHouseAccessory()
})
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
