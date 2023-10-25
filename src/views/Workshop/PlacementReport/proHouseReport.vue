<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">生产安置意愿</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 生产安置意愿报表 </div>
      </div>
      <el-table
        class="flex-col flex-1"
        :data="tableData"
        height="250px"
        border
        show-summary
        style="width: 100%"
      >
        <el-table-column prop="name" label="区域/户主" align="center" />
        <el-table-column prop="familyNumber" label="总人数(人)" align="center" />

        <el-table-column prop="countAgriculture" label="农业安置(人)" align="center" />
        <el-table-column prop="countRetirement" label="养老保险(人)" align="center" />
        <el-table-column prop="countSelfEmployee" label="自谋职业(人)" align="center" />
      </el-table>
      已选占比:{{ percent * 100 + '%' }}
      <div class="py-[10px] bg-[#fff]">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { reactive, ref } from 'vue'

import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { getProHouseReportListApi } from '@/api/workshop/placementReport/service'
const { back } = useRouter()

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const pageSize = ref(10)
const pageNum = ref(1)
const totalNum = ref(0)
const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'qy',
    label: '区域',
    search: {
      show: true,
      component: 'Select'
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
    field: 'doorNo',
    label: '户号',
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
    label: '姓名',
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
// const { tableObject, methods } = useTable({
//   getListApi: getProHouseReportListApi
// })
// const { getList, setSearchParams } = methods

const tableData = ref([])
const percent = ref()
const getProHouseReportList = (page, size) => {
  const params = {
    page: page,
    size: size
  }
  getProHouseReportListApi(params).then((res) => {
    console.log('res', res)
    tableData.value = res.reports.content
    totalNum.value = res.reports.total
    percent.value = res.percent
  })
}

getProHouseReportList('0', pageSize.value)
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getProHouseReportList('0', pageSize.value)
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val - 1
  getProHouseReportList(pageNum.value, pageSize.value)
}
const onBack = () => {
  back()
}
</script>

<style scoped></style>
