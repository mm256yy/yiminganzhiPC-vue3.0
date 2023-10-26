<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">居民户按工作分组</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap" style="display: none">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 居民户按工作分组报表 </div>
      </div>
      <el-table :height="getHeight(tableData)" :data="tableData" border style="width: 100%">
        <el-table-column label="序号" align="center" width="60">
          <template #default="scope">
            <span> {{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gridmanName" label="工作组" align="center" width="60" />
        <el-table-column prop="totalHouse" label="总任务数（户）" align="center" />
        <!-- 公寓房 -->
        <el-table-column label="动迁阶段(户)" align="center">
          <el-table-column label="资格认定" align="center">
            <el-table-column
              prop="populationStatusCount"
              label="人口核定"
              align="center"
              width="90"
            />
            <el-table-column
              prop="propertyStatusCount"
              label="房屋产权"
              align="center"
              width="90"
            />
          </el-table-column>
          <el-table-column label="资产评估" width="120" align="center">
            <el-table-column prop="appendageStatus" label="房屋/附属物" align="center" />
            <el-table-column prop="landStatus" label="土地/附着物" align="center" />
          </el-table-column>

          <el-table-column label="安置确认" align="center">
            <el-table-column prop="productionArrangementStatus" label="生产安置" align="center" />

            <el-table-column prop="relocateArrangementStatus" label="搬迁安置" align="center" />

            <el-table-column prop="graveStatus" label="坟墓确认" align="center" />
          </el-table-column>

          <el-table-column label="择址确认" align="center">
            <el-table-column prop="landUseStatus" label="生产用地" align="center" />
            <el-table-column prop="chooseHouseStatus" label="选房择址" align="center" />
            <el-table-column prop="chooseGraveStatus" label="坟墓择址" align="center" />
          </el-table-column>
          <el-table-column label="腾空过渡" align="center">
            <el-table-column prop="houseSoarStatus" label="房屋腾空" align="center" />
            <el-table-column prop="landSoarStatus" label="土地腾让" align="center" />
            <el-table-column prop="excessStatus" label="过渡安置" align="center" />
          </el-table-column>
          <el-table-column prop="agreementStatus" label="动迁协议" align="center" />
        </el-table-column>
        <el-table-column label="安置阶段(户)" align="center">
          <el-table-column label="搬迁安置" align="center">
            <el-table-column prop="buildOneselfStatus" label="自建房" align="center" width="120" />

            <el-table-column prop="flatsStatus" label="公寓房" align="center" width="120" />
            <el-table-column
              prop="centralizedSupportStatus"
              label="集中供养"
              align="center"
              width="120"
            />
            <el-table-column prop="selfSeekingStatus" label="自谋出路" align="center" width="120" />
          </el-table-column>

          <el-table-column label="生产安置" align="center">
            <el-table-column
              prop="aricutureArrangementStatus"
              label="农业安置"
              align="center"
              width="120"
            />

            <el-table-column prop="retirementStatus" label="养老保险" align="center" width="120" />
            <el-table-column
              prop="selfEmploymentStatus"
              label="自谋职业"
              align="center"
              width="120"
            />
          </el-table-column>
          <el-table-column
            prop="proceduresStatus"
            label="相关手续
"
            align="center"
            width="120"
          />
        </el-table-column>
      </el-table>

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
import { getResidentWorkListApi } from '@/api/workshop/scheduleReport/service'
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

const tableData = ref([])

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getResidentWorkList(pageNum.value - 1, pageSize.value)
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getResidentWorkList(pageNum.value - 1, pageSize.value)
}
//查询报表数据
const getResidentWorkList = (page, size) => {
  const params = { page, size }
  getResidentWorkListApi(params).then((res) => {
    tableData.value = res
    totalNum.value = tableData.value.length
  })
}
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
onMounted(() => {
  getResidentWorkList('0', pageSize.value)
})
const onBack = () => {
  back()
}
</script>

<style scoped></style>
