<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <ElTable
        v-loading="tableLoading"
        :data="tableData1.tableList"
        style="width: 100%; max-height: 500px"
        height="500"
        :span-method="objectSpanMethod1"
      >
        <ElTableColumn type="index" width="100" label="序号" />
        <ElTableColumn prop="townCodeText" label="行政村" />
        <ElTableColumn prop="name" label="名称" />
        <ElTableColumn prop="legalPersonName" label="法人代表" />
        <ElTableColumn prop="landUseNature" label="用地性质" />
        <ElTableColumn prop="industryType" label="所属行业" />
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
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useTable } from '@/hooks/web/useTable'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import {
  getEnterprise,
  deleteFunPayApi,
  getFunPaySumAmountApi
} from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const headInfo = ref<any>()
const districtTree = ref<any[]>([])
const tableLoading = ref<boolean>(false)

let tableData1 = reactive<any>({
  tableList: [],
  pageSizeRef: 10,
  currentPageRef: 1,
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
const getEnterpriseAsync = async (e: any) => {
  tableLoading.value = true
  try {
    let list = await getEnterprise(e)
    tableData1.tableList = list.content
    tableData1.total = list.total
    tableLoading.value = false
    return list
  } catch {
    tableLoading.value = false
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
  getEnterpriseAsync({ projectId, size: tableData1.pageSizeRef, page: tableData1.currentPageRef })
}

const handleCurrentChange = (val: number) => {
  tableData1.currentPageRef = val - 1
  getEnterpriseAsync({ projectId, size: tableData1.pageSizeRef, page: tableData1.currentPageRef })
}

onMounted(() => {
  getHeadInfo()
  getdistrictTree()
  getEnterpriseAsync({ projectId, size: 10, page: 0 })
})
</script>

<style lang="less" scoped></style>
