<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智慧报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">只征地不搬迁</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金发放明细</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left max-header">
          <span style="font-size: 14px; font-weight: 600">权属明细列表</span>
          <div>
            <span>（共 {{ tableObject.total }}条土地数据）</span>
          </div>
        </div>
        <ElSpace style="align-items: baseline">
          <ElButton type="primary" @click="onExport()"> 数据导出 </ElButton>
        </ElSpace>
      </div>
      <Table
        ref="tabalRef"
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableLoading"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        :selection="true"
        @register="register"
      >
        <template #ownership="{ row }">
          <div>{{
            (row.cityCodeText || '') +
            '-' +
            (row.areaCodeText || '') +
            '-' +
            (row.townCodeText || '') +
            '-' +
            (row.villageCodeText || '')
          }}</div>
        </template>
        <template #landLevel="{ row }">
          <div>{{ row.landTypeText }}</div>
        </template>
        <template #1="{ row }">
          {{ row[1].includes('jl') ? row[1].replace('jl', '') : row[1] }}
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElSpace } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import {
  getFundDetailLandNoMoveList,
  exportFundDetailLandNoMoveList
} from '@/api/fundManage/fundPayment-service'
import { getDistrictTreeApi } from '@/api/district'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
const dictStore = useDictStoreWithOut()
const districtTree = ref<any[]>([])
const tableLoading = ref<boolean>()
let schemas = reactive<any>({
  columns: []
})
const { back } = useRouter()

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const onBack = () => {
  back()
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

const { register, tableObject } = useTable()

// getList()
const getdistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
  districtTree.value.push({
    name: '其他',
    code: '1'
  })
  return list || []
}

onMounted(() => {
  getdistrictTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '权属单位',
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
    field: 'doorNo',
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
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'rightHolder',
    label: '使用权人',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用权人'
      }
    },
    table: {
      show: false
    }
  }
])

let { allSchemas } = useCrudSchemas(schema)

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

const getTableDepends = (list: any) => {
  let columns: any = [
    {
      field: 'index',
      label: '序号',
      type: 'index',
      width: 80
    },
    {
      field: '0',
      label: '权属单位',
      width: 120,
      ...commonTableItemSchema
    },
    {
      width: 120,
      field: '1',
      label: '户号',
      ...commonTableItemSchema
    },
    {
      field: '2',
      label: '使用权人',
      ...commonTableItemSchema
    },
    {
      field: '3',
      label: '地上青苗及附着物补偿费',
      children: [
        {
          field: '3',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '4',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '4',
      label: '土地补偿费(集体土地)',
      children: [
        {
          field: '5',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '6',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '5',
      label: '土地补偿费(国有土地)',
      children: [
        {
          field: '7',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '8',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '6',
      label: '签约奖',
      children: [
        {
          field: '9',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '10',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '7',
      label: '腾空奖',
      children: [
        {
          field: '11',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '12',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '8',
      label: '其他奖励费',
      children: [
        {
          field: '13',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '14',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    }
  ]
  let allData = useCrudSchemas(columns)
  schemas.columns = allData.allSchemas.tableColumns
  tableObject.tableList = list
}

const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))

  // 处理参数
  let params = {
    ...searchData
  }
  params[getParamsKey('Country')] = null
  params[getParamsKey('Township')] = null
  params[getParamsKey('Village')] = null
  params[getParamsKey('NaturalVillage')] = null
  params.ownershipUnitIsNull = null
  if (params.grantTime) {
    params.grantTime = [params.grantTime]
  }

  if (params.code == '1') {
    params.ownershipUnitIsNull = '1'
    delete params.code
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

  getTableList()
}

const onReset = () => {
  tableObject.params = {}
  getTableList()
}

let onExport = async () => {
  const params = getSearchParams()
  const res = await exportFundDetailLandNoMoveList(params)
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

const getSearchParams = () => {
  return {
    ...tableObject.params,
    size: tableObject.size,
    page: tableObject.currentPage,
    phType: 'LandNoMove'
  }
}

const getTableList = async () => {
  tableLoading.value = true
  const params = getSearchParams()
  const res = await getFundDetailLandNoMoveList(params).finally(() => {
    tableLoading.value = false
  })
  if (res) {
    // 赋值表格数据
    res.list.content.forEach((item) => {
      return item.shift()
    })
    tableObject.total = res.list.total
    getTableDepends(res.list.content)
  }
}

getTableList()

watch(
  () => tableObject.currentPage,
  () => {
    getTableList()
  }
)

watch(
  () => tableObject.size,
  () => {
    // 当前页不为1时，修改页数后会导致多次调用getList方法
    if (tableObject.currentPage === 1) {
      getTableList()
    } else {
      tableObject.currentPage = 1
      getTableList()
    }
  }
)
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.ElButton-form-wrap {
  display: block;
  padding: var(--distance-base);
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.numFont {
  font-size: 14px;
}

.max-header {
  width: 1000px;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}
</style>
