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
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title">企业基本情况统计表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable
        v-loading="tableLoading"
        :data="tableData1.tableList"
        style="width: 100%; max-height: 520px"
        height="520"
      >
        <ElTableColumn type="index" width="80" label="序号" align="center" />
        <ElTableColumn prop="villageText" label="行政村" show-overflow-tooltip />
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
        <ElTableColumn prop="legalPersonName" label="法人代表" />
        <ElTableColumn prop="landUseNature" label="用地性质" />
        <ElTableColumn prop="industryType" label="所属行业">
          <template #default="{ row }">
            {{ dictObj[215].filter((item) => item.value == row.industryType)[0]?.label }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="licenceNo" label="工商证" />
        <ElTableColumn prop="productCategory" label="主要产品" />
        <ElTableColumn prop="averageAnnualOutputValue" label="年产值（万元）" />
        <ElTableColumn prop="averageAnnualProfit" label="年利润（万元）" />
        <ElTableColumn prop="workNum" label="从业人员（人）" />
      </ElTable>
      <ElPagination
        v-model:pageSize="tableData1.pageSizeRef"
        v-model:currentPage="tableData1.currentPageRef"
        class="mt-10px"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="sizes, prev, pager, next, jumper, ->, total"
        :total="tableData1.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElTable, ElTableColumn, ElPagination, ElButton } from 'element-plus'
import { getEnterprise, getFunPaySumAmountApi } from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import { exportReportApi } from '@/api/fundManage/fundPayment-service'
import { useDictStoreWithOut } from '@/store/modules/dict'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const headInfo = ref<any>()
const districtTree = ref<any[]>([])
const tableLoading = ref<boolean>(false)

let tableData1 = reactive<any>({
  tableList: [],
  pageSizeRef: 10,
  currentPageRef: 0,
  total: 0
})
const { tableObject } = useTable()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
tableObject.params = {
  projectId,
  type: 'Company'
}

const getHeadInfo = async () => {
  const info = await getFunPaySumAmountApi()
  headInfo.value = info
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
const getEnterpriseAsync = async () => {
  const params = {
    ...tableObject.params,
    page: tableData1.currentPageRef,
    size: tableData1.pageSizeRef
  }

  tableLoading.value = true
  try {
    let list = await getEnterprise(params)
    tableData1.tableList = list.content
    tableData1.total = list.total
    tableLoading.value = false
    return list
  } catch {
    tableLoading.value = false
  }
}

const handleSizeChange = (val: number) => {
  tableData1.pageSizeRef = val
  console.log('size-change', val)
  getEnterpriseAsync()
}

const handleCurrentChange = (val: number) => {
  tableData1.currentPageRef = val - 1
  getEnterpriseAsync()
}

const onExport = async () => {
  const params = tableObject.params
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

const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'villageCode',
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
    field: 'doorNo',
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

  tableObject.params = {
    ...tableObject.params,
    ...params
  }

  getEnterpriseAsync()
}

const onReset = () => {
  tableObject.params = {
    projectId,
    type: 'Company'
  }
  getEnterpriseAsync()
}

onMounted(() => {
  getHeadInfo()
  getdistrictTree()
  getEnterpriseAsync()
})
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
