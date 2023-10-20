<template>
  <WorkContentWrap>
    <!-- <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div> -->

    <div class="table-wrap">
      <ElTable :data="tableData1.tableList" style="width: 100%" :span-method="objectSpanMethod1">
        <ElTableColumn type="index" label="序号" />
        <ElTableColumn prop="townCodeText" label="行政村" />
        <ElTableColumn prop="name" label="名称" />
        <ElTableColumn prop="legalPersonName" label="法人代表" />
        <ElTableColumn prop="licenceNo" label="工商证" />
        <ElTableColumn prop="landUseNature" label="用地性质" />
        <ElTableColumn prop="industryType" label="所属行业" />
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
        :total="tableData1.totol"
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
// import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import {
  getEnterprise,
  deleteFunPayApi,
  getFunPaySumAmountApi
} from '@/api/fundManage/fundPayment-service'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { getVillageTreeApi } from '@/api/workshop/village/service'
const appStore = useAppStore()
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
const projectId = appStore.currentProjectId
const headInfo = ref<any>()
const districtTree = ref<any[]>([])
let tableData1 = reactive<any>({
  tableList: [],
  pageSizeRef: 10,
  currentPageRef: 1,
  totol: 0
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
  let list = await getEnterprise(e)
  console.log(list)
  tableData1.tableList = list.content
  tableData1.totol = list.total
  return list
}

// const schema = reactive<CrudSchema[]>([
//   {
//     field: 'code',
//     label: '所属区域',
//     search: {
//       show: true,
//       component: 'TreeSelect',
//       componentProps: {
//         data: districtTree,
//         nodeKey: 'code',
//         props: {
//           value: 'code',
//           label: 'name'
//         },
//         showCheckbox: true,
//         checkStrictly: true,
//         checkOnClickNode: true
//       }
//     },
//     table: {
//       show: false
//     }
//   }

//   // table
// ])

// let { allSchemas } = useCrudSchemas(schema)

// const onSearch = (data) => {
//   //解决是否户主relation入参变化
//   let searchData = JSON.parse(JSON.stringify(data))
//   console.log(searchData)

//   if (searchData.relation == '1') {
//     searchData.relation = ['is', 1]
//   } else if (searchData.relation == '0') {
//     searchData.relation = ['not', 1]
//   } else {
//     delete searchData.relation
//   }

//   // 处理参数
//   let params = {
//     ...searchData
//   }
//   tableObject.params = {
//     projectId
//   }
//   if (params.code) {
//     delete params.code
//     setSearchParams({ ...params })
//   } else {
//     delete params.code
//     setSearchParams({ ...params })
//   }
// }

const objectSpanMethod1 = ({
  // row,
  // column,
  rowIndex,
  columnIndex
}) => {
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
