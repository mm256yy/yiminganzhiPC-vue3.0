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
      <div class="flex items-center justify-between pb-5px">
        <div class="table-left-title">零星林（果）木统计表 </div>
        <!-- <ElButton type="primary" @click="onExport"> 数据导出 </ElButton> -->
      </div>
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        highlightCurrentRow
        height="600"
        style="width: 100%; max-height: 600px"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { getEnterpriseTree } from '@/api/fundManage/fundPayment-service'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
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

// 获取零星林（果）木数据
const requestFruitWood = async () => {
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
      label: '零星果木',
      children: [],
      ...commonTableItemSchema
    }
  ]
  tableLoading.value = true
  try {
    const result: any = await getEnterpriseTree()
    result.titles.forEach((item: any, index: any) => {
      if (result.usageTitles.includes(item)) {
        column[3].children.push({
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

  requestFruitWood()
}

const onReset = () => {
  requestFruitWood()
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
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

onMounted(() => {
  requestFruitWood()
  getdistrictTree()
})
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
