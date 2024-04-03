<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">基本情况</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>
    <div class="table-wrap" v-loading="tableLoading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title">个体户基本情况表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable :data="tableData1.tableList" style="width: 100%" :span-method="objectSpanMethod1">
        <ElTableColumn type="index" width="100" label="序号" align="center" />
        <ElTableColumn prop="townCodeText" label="行政村" />
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
        <ElTableColumn prop="legalPersonName" label="法人代表" />
        <!-- <ElTableColumn prop="landUseNature" label="用地性质" /> -->
        <ElTableColumn prop="licenceNo" label="工商证" />
        <ElTableColumn prop="industryType" label="所属行业">
          <template #default="{ row }">
            {{ dictObj[215].filter((item) => item.value == row.industryType)[0]?.label }}
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn prop="productCategory" label="主要产品" />
        <ElTableColumn prop="averageAnnualOutputValue" label="年产值（万元）" />
        <ElTableColumn prop="averageAnnualProfit" label="年利润（万元）" />
        <ElTableColumn prop="workNum" label="从业人员（人）" /> -->
        <ElTableColumn prop="locationTypeText" label="所在位置" />
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
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useTable } from '@/hooks/web/useTable'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import {
  getEnterprise,
  deleteFunPayApi,
  getFunPaySumAmountApi,
  exportReportApi
} from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Search } from '@/components/Search'

const { back } = useRouter()
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const headInfo = ref<any>()
const districtTree = ref<any[]>([])
const tableLoading = ref<boolean>(false)
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
let tableData1 = reactive<any>({
  tableList: [],
  pageSizeRef: 10,
  currentPageRef: 0,
  total: 0
})
const { tableObject, methods } = useTable({
  getListApi: getEnterprise,
  delListApi: deleteFunPayApi
})
const { getList } = methods

tableObject.params = {
  projectId
}

getList()

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
    return []
  }
}

const objectSpanMethod1 = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 1) {
    if (rowIndex === 0) {
      return {
        rowspan: 20,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
const handleSizeChange = (val: number) => {
  tableData1.pageSizeRef = val
  getEnterpriseAsync()
}
const handleCurrentChange = (val: number) => {
  tableData1.currentPageRef = val - 1
  getEnterpriseAsync()
}

const onBack = () => {
  back()
}

const onExport = async () => {
  const res = await exportReportApi({})
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
    label: '个体工商户编号',
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
    label: '个体工商户名称',
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
    projectId
    // type: 'Company'
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
</style>
