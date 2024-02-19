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
    <div class="title-hint">零星林(果)木统计表（区域报表）</div>
    <div class="table-wrap">
      <Table
        ref="tableRef"
        v-loading="tableLoading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        height="600"
        border
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
  getFruitWoodRegionListApi,
  exportRegionReportApi
} from '@/api/workshop/dataQuery/fruitWood-service'
import { screeningTree } from '@/api/workshop/village/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const tableLoading = ref<boolean>()
const code = ref<any>(null)
const villageTree = ref<any[]>([])

let tableObject = reactive({
  tableList: []
})

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
        showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true
      }
    },
    table: {
      show: false
    }
  },

  // table字段 分割
  {
    field: 'index',
    type: 'index',
    label: '序号',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'villageName',
    label: '区域名',
    search: {
      show: false
    }
  },
  {
    field: 'villageCode',
    label: '区域编码',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '品种',
    search: {
      show: false
    }
  },
  {
    field: 'size',
    label: '规格',
    search: {
      show: false
    }
  },
  {
    field: 'unit',
    label: '单位',
    search: {
      show: false
    }
  },
  {
    field: 'quantity',
    label: '数量',
    search: {
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
    let result: any = await getFruitWoodRegionListApi(params)
    tableObject.tableList = result
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  code.value = params.villageCode
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
    villageCode: code.value
  }
  const res = await exportRegionReportApi(params)
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

onMounted(() => {
  getVillageTree()
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
  font-size: 14px;
  color: 14px;
}
</style>
