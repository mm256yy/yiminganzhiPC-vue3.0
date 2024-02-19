<template>
  <WorkContentWrap>
<<<<<<< HEAD
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
        <div class="table-left-title">企业基本情况统计表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="schemas.columns"
=======
    <div class="table-wrap" v-loading="tableLoading">
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="allSchemas.columns"
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        highlightCurrentRow
        height="550"
        style="width: 100%; max-height: 550px"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
<<<<<<< HEAD
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getEnterpriseAppendant } from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'

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
    field: 'code',
    label: '企业编码',
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
    label: '企业名称',
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
  }
])

const { allSchemas } = useCrudSchemas(schema)

=======
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getEnterpriseAppendant } from '@/api/fundManage/fundPayment-service'

let tableRef = ref()
const tableLoading = ref<boolean>(false)
let allSchemas = reactive<any>({
  columns: []
})

>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
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
    const result: any = await getEnterpriseAppendant()
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
<<<<<<< HEAD
    schemas.columns = allData.allSchemas.tableColumns
=======
    allSchemas.columns = allData.allSchemas.tableColumns
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
    tableObject.tableList = result.list.reduce((pre, iem) => {
      pre.push({ ...iem })
      return pre
    }, [])
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

<<<<<<< HEAD
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

  requestHouseAccessory()
}

const onReset = () => {
  // tableObject.params = {
  // }
  // setSearchParams({})
  requestHouseAccessory()
}

const onExport = () => {
  // const params = {}
  // const res = await exportIndividualHouseholdTree(params)
  // let filename = res.headers
  // filename = filename['content-disposition']
  // filename = filename.split(';')[1].split('filename=')[1]
  // filename = decodeURIComponent(filename)
  // let elink = document.createElement('a')
  // document.body.appendChild(elink)
  // elink.style.display = 'none'
  // elink.download = filename
  // let blob = new Blob([res.data])
  // const URL = window.URL || window.webkitURL
  // elink.href = URL.createObjectURL(blob)
  // elink.click()
  // document.body.removeChild(elink)
  // URL.revokeObjectURL(elink.href)
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
=======
onMounted(() => {
  requestHouseAccessory()
})
</script>
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
