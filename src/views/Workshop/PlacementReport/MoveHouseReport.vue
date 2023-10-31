<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        class="px-9px py-0px !h-28px mr-8px !text-12px !hidden"
      >
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">搬迁安置意愿</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap" style="display: none">
      <Search :schema="allSchemas.searchSchema" @search="handleSearch" @reset="setSearchParams" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 搬迁安置意愿报表 </div>
      </div>
      <el-table
        :height="tableData.length > 0 ? getHeight(tableData) : '300'"
        :span-method="objectSpanMethod"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="户主" align="center" width="180" />
        <!-- 公寓房 -->
        <el-table-column label="公寓房(套)" align="center">
          <el-table-column label="曙光安置区" width="120" align="center">
            <el-table-column prop="flatSG7Count" label="70" align="center" width="50" />
            <el-table-column prop="flatSG9Count" label="90" align="center" width="50" />
            <el-table-column prop="flatSG11Count" label="110" align="center" width="50" />
            <el-table-column prop="flatSG13Count" label="130" align="center" width="50" />
          </el-table-column>
          <el-table-column label="镜岭集镇安置区" width="120" align="center">
            <el-table-column prop="flatJL7Count" label="70" align="center" width="50" />
            <el-table-column prop="flatJL9Count" label="90" align="center" width="50" />
            <el-table-column prop="flatJL11Count" label="110" align="center" width="50" />
            <el-table-column prop="flatJL13Count" label="130" align="center" width="50" />
          </el-table-column>
        </el-table-column>

        <!-- 宅基地(宗) -->
        <el-table-column prop="test" label="宅基地(宗)" align="center">
          <el-table-column label="棠村安置区" align="center">
            <el-table-column prop="homestedTC1AreaCount" label="48" align="center" width="50" />
            <el-table-column prop="homestedTC2AreaCount" label="72" align="center" width="50" />
            <el-table-column prop="homestedTC3AreaCount" label="96" align="center" width="50" />
            <el-table-column prop="homestedTC4AreaCount" label="120" align="center" width="50" />
            <el-table-column prop="homestedTC5AreaCount" label="144" align="center" width="50" />
            <el-table-column prop="homestedTC6AreaCount" label="168" align="center" width="50" />
          </el-table-column>
          <el-table-column label="麻家田安置区" align="center">
            <el-table-column prop="homestedMJT1AreaCount" label="48" align="center" width="50" />
            <el-table-column prop="homestedMJT2AreaCount" label="72" align="center" width="50" />
            <el-table-column prop="homestedMJT3AreaCount" label="96" align="center" width="50" />
            <el-table-column prop="homestedMJT4AreaCount" label="120" align="center" width="50" />
            <el-table-column prop="homestedMJT5AreaCount" label="144" align="center" width="50" />
            <el-table-column prop="homestedMJT6AreaCount" label="168" align="center" width="50" />
          </el-table-column>
          <el-table-column label="东坪安置区" align="center">
            <el-table-column prop="homestedDP1AreaCount" label="48" align="center" width="50" />
            <el-table-column prop="homestedDP2AreaCount" label="72" align="center" width="50" />
            <el-table-column prop="homestedDP3AreaCount" label="96" align="center" width="50" />
            <el-table-column prop="homestedDP4AreaCount" label="120" align="center" width="50" />
            <el-table-column prop="homestedDP5AreaCount" label="144" align="center" width="50" />
            <el-table-column prop="homestedDP6AreaCount" label="168" align="center" width="50" />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="oneselfCount" label="自谋出路(户)" align="center">
          <template #default="{ row }">
            {{ row.oneselfCount ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="concentrateCount" label="集中供养(户)" align="center">
          <template #default="{ row }">
            {{ row.concentrateCount ?? '-' }}
          </template>
        </el-table-column>
      </el-table>
      <p class="w-[180px] text-center text-[14px] mt-[5px]">已选占比:{{ percent }}</p>
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
import { reactive, ref, onMounted } from 'vue'
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
const { methods } = useTable()
const { setSearchParams } = methods

const tableData = ref<any>([])
const percent = ref() //已选占比

/**
 * 计算 table 的高度
 * @param arr 当前 table 的数据
 */
const getHeight = (arr: any) => {
  if (arr.length === 0) {
    return 150
  } else if (arr.length > 9) {
    return 500
  } else {
    return 'auto'
  }
}
const handleSearch = () => {
  getMoveHouseReportList('0', '10')
}
const getMoveHouseReportList = (page, size) => {
  const params = {
    page: page,
    size: size
  }
  getMoveHouseReportListApi(params).then((res) => {
    tableData.value = res.reports.content
    percent.value = toPercent(res.percent)
    totalNum.value = res.reports.total
    const tableArr = tableData.value
    tableArr.push(
      {
        name: '合计（套/宗)',
        flatSG7Count: totalColumn(tableArr, 'flatSG7Count'),
        flatSG9Count: totalColumn(tableArr, 'flatSG9Count'),
        flatSG11Count: totalColumn(tableArr, 'flatSG11Count'),
        flatSG13Count: totalColumn(tableArr, 'flatSG13Count'),
        flatJL7Count: totalColumn(tableArr, 'flatJL7Count'),
        flatJL9Count: totalColumn(tableArr, 'flatJL9Count'),
        flatJL11Count: totalColumn(tableArr, 'flatJL11Count'),
        flatJL13Count: totalColumn(tableArr, 'flatJL13Count'),
        homestedTC1AreaCount: totalColumn(tableArr, 'homestedTC1AreaCount'),
        homestedTC2AreaCount: totalColumn(tableArr, 'homestedTC2AreaCount'),
        homestedTC3AreaCount: totalColumn(tableArr, 'homestedTC3AreaCount'),
        homestedTC4AreaCount: totalColumn(tableArr, 'homestedTC4AreaCount'),
        homestedTC5AreaCount: totalColumn(tableArr, 'homestedTC5AreaCount'),
        homestedTC6AreaCount: totalColumn(tableArr, 'homestedTC6AreaCount'),
        homestedMJT1AreaCount: totalColumn(tableArr, 'homestedMJT1AreaCount'),
        homestedMJT2AreaCount: totalColumn(tableArr, 'homestedMJT2AreaCount'),
        homestedMJT3AreaCount: totalColumn(tableArr, 'homestedMJT3AreaCount'),
        homestedMJT4AreaCount: totalColumn(tableArr, 'homestedMJT4AreaCount'),
        homestedMJT5AreaCount: totalColumn(tableArr, 'homestedMJT5AreaCount'),
        homestedMJT6AreaCount: totalColumn(tableArr, 'homestedMJT6AreaCount'),
        homestedDP1AreaCount: totalColumn(tableArr, 'homestedDP1AreaCount'),
        homestedDP2AreaCount: totalColumn(tableArr, 'homestedDP2AreaCount'),
        homestedDP3AreaCount: totalColumn(tableArr, 'homestedDP3AreaCount'),
        homestedDP4AreaCount: totalColumn(tableArr, 'homestedDP4AreaCount'),
        homestedDP5AreaCount: totalColumn(tableArr, 'homestedDP5AreaCount'),
        homestedDP6AreaCount: totalColumn(tableArr, 'homestedDP6AreaCount')
      },
      {
        name: '合计(户)',
        flatSG7Count: totalApparent(tableArr),
        homestedTC1AreaCount: totalHomestead(tableArr),
        oneselfCount: totalColumn(tableArr, 'oneselfCount'),
        concentrateCount: totalColumn(tableArr, 'concentrateCount')
      }
    )
  })
}
const toPercent = (point) => Number(point * 100).toFixed(2) + '%'

onMounted(() => {
  getMoveHouseReportList('0', '10')
})

const onBack = () => {
  back()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMoveHouseReportList(pageNum.value - 1, pageSize.value)
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getMoveHouseReportList(pageNum.value - 1, pageSize.value)
}
//合并合计户单元格
const objectSpanMethod = ({ row, columnIndex }: any) => {
  if (row.name === '合计(户)') {
    if (columnIndex === 1) {
      return {
        rowspan: 1,
        colspan: 8
      }
    }
    //把被合并的单元格进行处理
    if (columnIndex > 1 && columnIndex <= 8) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
    if (columnIndex === 13) {
      return {
        rowspan: 1,
        colspan: 18
      }
    }
    //把被合并的单元格进行处理
    if (columnIndex > 13 && columnIndex < 25) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
//合计表格列
const totalColumn = (arr, key) => {
  let s = 0
  arr.forEach((item) => {
    const num = Number(item[key])
    if (!isNaN(num)) {
      s += num
    }
  })
  return s
}
//公寓房合计
const totalApparent = (arr) => {
  let s = 0
  arr.forEach((item) => {
    let total =
      Number(item.flatTC7Count) +
      Number(item.flatTC9Count) +
      Number(item.flatTC11Count) +
      Number(item.flatTC13Count) +
      Number(item.flatMJ7Count) +
      Number(item.flatMJ9Count) +
      Number(item.flatMJ11Count) +
      Number(item.flatMJ13Count) +
      Number(item.flatDP7Count) +
      Number(item.flatDP9Count) +
      Number(item.flatDP11Count) +
      Number(item.flatDP13Count)
    if (total >= 1) {
      total = 1
      s++
    }
  })
  return s
}
//宅基地合计
const totalHomestead = (arr) => {
  let s = 0
  arr.forEach((item) => {
    let total =
      Number(item.homesteadSG4Count) +
      Number(item.homesteadSG7Count) +
      Number(item.homesteadSG9Count) +
      Number(item.homesteadSG12Count) +
      Number(item.homesteadSG14Count) +
      Number(item.homesteadSG16Count) +
      Number(item.homesteadJL4Count) +
      Number(item.homesteadJL7Count) +
      Number(item.homesteadJL9Count) +
      Number(item.homesteadJL12Count) +
      Number(item.homesteadJL14Count) +
      Number(item.homesteadJL16Count)
    if (total >= 1) {
      total = 1
      s++
    }
  })
  return s
}
</script>

<style scoped></style>
