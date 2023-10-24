<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">搬迁安置意愿</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 搬迁安置意愿报表 </div>
      </div>
      <el-table
        height="250px"
        :span-method="objectSpanMethod"
        show-summary
        :summary-method="getSummaries"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="户主" align="center" width="180">
          <!-- <template #default="scope">
            {{ scope.row.hz }}
          </template> -->
        </el-table-column>
        <!-- 公寓房 -->
        <el-table-column label="公寓房(套)" align="center">
          <el-table-column label="曙光安置区" width="120" align="center">
            <el-table-column prop="flatDP7Count" label="70" align="center" width="50" />
            <el-table-column prop="flatDP9Count" label="90" align="center" width="50" />
            <el-table-column prop="flatDP11Count" label="110" align="center" width="50" />
            <el-table-column prop="d" label="130" align="center" width="50" />
          </el-table-column>
          <el-table-column label="镜岭集镇安置区" width="120" align="center">
            <el-table-column prop="flatMJ7Count" label="70" align="center" width="50" />
            <el-table-column prop="flatMJ9Count" label="90" align="center" width="50" />
            <el-table-column prop="flatMJ11Count" label="110" align="center" width="50" />
            <el-table-column prop="h" label="130" align="center" width="50" />
          </el-table-column>
        </el-table-column>
        <!-- 宅基地(宗) -->
        <el-table-column prop="test" label="宅基地(宗)" align="center">
          <el-table-column label="棠村安置区" align="center">
            <el-table-column prop="flatTC7Count" label="48" align="center" width="50" />
            <el-table-column prop="j" label="72" align="center" width="50" />
            <el-table-column prop="k" label="96" align="center" width="50" />
            <el-table-column prop="l" label="120" align="center" width="50" />
            <el-table-column prop="m" label="144" align="center" width="50" />
            <el-table-column prop="n" label="168" align="center" width="50" />
          </el-table-column>
          <el-table-column label="麻家田安置区" align="center">
            <el-table-column prop="o" label="48" align="center" width="50" />
            <el-table-column prop="p" label="72" align="center" width="50" />
            <el-table-column prop="q" label="96" align="center" width="50" />
            <el-table-column prop="r" label="120" align="center" width="50" />
            <el-table-column prop="s" label="144" align="center" width="50" />
            <el-table-column prop="t" label="168" align="center" width="50" />
          </el-table-column>
          <el-table-column label="东坪安置区" align="center">
            <el-table-column prop="u" label="48" align="center" width="50" />
            <el-table-column prop="v" label="72" align="center" width="50" />
            <el-table-column prop="w" label="96" align="center" width="50" />
            <el-table-column prop="x" label="120" align="center" width="50" />
            <el-table-column prop="y" label="144" align="center" width="50" />
            <el-table-column prop="z" label="168" align="center" width="50" />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="zmcl" label="自谋出路(户)" />
        <el-table-column prop="jzgy" label="集中供养(户)" fixed="right" />
      </el-table>
      <p class="w-[180px] text-center text-[14px] mt-[5px]">已选占比:</p>
      <div class="py-[10px] bg-[#fff]">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[100, 200, 300, 400]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
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
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { getMoveHouseReportListApi } from '@/api/workshop/placementReport/service'
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
const { methods } = useTable({})
const { getList, setSearchParams } = methods
getList()
const getMoveHouseReportList = (page, size) => {
  const params = {
    page: page,
    size: size
  }
  getMoveHouseReportListApi(params).then((res) => {
    console.log('res22', res)
    tableData.value = res.reports.content
  })
}
const tableData = ref([])
getMoveHouseReportList('0', '10')
const onBack = () => {
  back()
}
// const getSummaries = (param) => {
//   const { columns, data } = param
//   const sums = [] as any[]
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '合计（户数）'
//       return
//     }
//     const values = data.map((item) => Number(item[column.property]))
//     if (!values.every((value) => isNaN(value))) {
//       sums[index] = values.reduce((prev, curr) => {
//         const value = Number(curr)
//         if (!isNaN(value)) {
//           return prev + curr
//         } else {
//           return prev
//         }
//       }, 0)
//       sums[index] += ''
//     } else {
//       sums[index] = 'N/A'
//     }
//   })

//   return sums
// }
const sums = (arr, key) => {
  let s = 0
  arr.forEach((item) => {
    const num = Number(item[key])
    if (!isNaN(num)) {
      s += num
    }
  })
  return s
}

// tableData.value.push(
//   { hz: '合计（套/宗)', a: sums(tableData.value, 'a'), b: sums(tableData.value, 'b') },
//   { hz: '合计' }
// )

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (row.hz === '合计') {
    if (columnIndex === 1) {
      return {
        rowspan: 1,
        colspan: 8
      }
    }
    if (columnIndex === 2) {
      return {
        rowspan: 1,
        colspan: 18
      }
    }
  }
}
// const isNum1 = (arr) => {
//   arr.forEach((item) => {
//     let res
//     const total1 = Number(item.a + item.b + item.c + item.d + item.e + item.f + item.g + item.h)
//   })
//   if (total >= 1) {
//     return (res = 1)
//   }
// }
// const toTalGyf = (arr) => {
//   let total = 0
//   let total = isNum1(arr)
//   return total
// }
</script>

<style scoped></style>
