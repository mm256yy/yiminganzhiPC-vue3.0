<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">居民户分区域</ElBreadcrumbItem>
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
        <div class="table-left-title"> 居民户分区域报表 </div>
      </div>
      <el-table
        :data="tableData"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%"
        :height="tableHeight"
        ref="tableRef"
      >
        <el-table-column label="序号" align="center" width="60">
          <template #default="scope">
            <span> {{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="doorNo" label="户号" align="center" width="60" />
        <el-table-column prop="name" label="户主" align="center" width="60" />
        <!-- 公寓房 -->
        <el-table-column label="动迁阶段(户)" align="center">
          <el-table-column label="资格认定" align="center">
            <el-table-column
              prop="populationStatusCount"
              label="人口核定"
              align="center"
              width="90"
            >
              <template #default="{ row }">
                <Icon
                  v-if="row.populationStatusCount == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="propertyStatusCount" label="房屋产权" align="center" width="90">
              <template #default="{ row }">
                <Icon
                  v-if="row.propertyStatusCount == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                /> </template
            ></el-table-column>
          </el-table-column>
          <el-table-column label="资产评估" width="120" align="center">
            <el-table-column prop="appendageStatus" label="房屋/附属物" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.appendageStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="landStatus" label="土地/附着物" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.landStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="安置确认" align="center">
            <el-table-column prop="productionArrangementStatus" label="生产安置" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.productionArrangementStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>

            <el-table-column prop="relocateArrangementStatus" label="搬迁安置" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.relocateArrangementStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>

            <el-table-column prop="graveStatus" label="坟墓确认" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.graveStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="择址确认" align="center">
            <el-table-column prop="landUseStatus" label="生产用地" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.landUseStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="chooseHouseStatus" label="选房择址" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.chooseHouseStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="chooseGraveStatus" label="坟墓择址" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.chooseGraveStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="cardStatusCount" label="移民建卡" align="center">
            <template #default="{ row }">
              <Icon
                v-if="row.cardStatusCount == '1'"
                class="active-icon"
                icon="ep:check"
                color="#000"
              />
            </template>
          </el-table-column>
          <el-table-column label="腾空过渡" align="center">
            <el-table-column prop="houseSoarStatus" label="房屋腾空" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.houseSoarStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="landSoarStatus" label="土地腾让" align="center">
              <!-- <template #default="{ row }">
                <div v-if="row.landSoarStatus =='1'">
                  <Icon class="active-icon" icon="ep:check" color="#000" />
                  111111
                </div>
              </template> -->
            </el-table-column>
            <el-table-column prop="excessStatus" label="过渡安置" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.excessStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="agreementStatus" label="动迁协议" align="center">
            <template #default="{ row }">
              <Icon
                v-if="row.agreementStatus == '1'"
                class="active-icon"
                icon="ep:check"
                color="#000"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="安置阶段(户)" align="center">
          <el-table-column label="搬迁安置" align="center">
            <el-table-column prop="buildOneselfStatus" label="自建房" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.buildOneselfStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>

            <el-table-column prop="flatsStatus" label="公寓房" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.flatsStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="centralizedSupportStatus"
              label="集中供养"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                <Icon
                  v-if="row.centralizedSupportStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="selfSeekingStatus" label="自谋出路" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.selfSeekingStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="生产安置" align="center">
            <el-table-column
              prop="aricutureArrangementStatus"
              label="农业安置"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                <Icon
                  v-if="row.aricutureArrangementStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                /> </template
            ></el-table-column>

            <el-table-column prop="retirementStatus" label="养老保险" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.retirementStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                /> </template
            ></el-table-column>
            <el-table-column
              prop="selfEmploymentStatus"
              label="自谋职业"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                <Icon
                  v-if="row.selfEmploymentStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="proceduresStatus"
            label="相关手续
"
            align="center"
            width="120"
          >
            <template #default="{ row }">
              <Icon
                v-if="row.proceduresStatus == '1'"
                class="active-icon"
                icon="ep:check"
                color="#000"
              />
            </template>
          </el-table-column>
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
import { reactive, ref, onMounted, watch, nextTick } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { getResidentRegionListApi } from '@/api/workshop/scheduleReport/service'
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
const tableRef = ref()
const tableHeight = ref(200)
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getResidentRegionList(pageNum.value - 1, pageSize.value)
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getResidentRegionList(pageNum.value - 1, pageSize.value)
}
//查询报表数据
const getResidentRegionList = (page, size) => {
  const params = { page, size }
  getResidentRegionListApi(params).then((res) => {
    tableData.value = res.content
    totalNum.value = res.total
  })
}
//计算合计行并合并单元格
const getSummaries = (param) => {
  const { columns } = param
  const sums: any[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计（户数）'
      column.colSpan = 3
    } else {
      sums[index] = pageSize.value
    }
  })
  return sums
}
onMounted(() => {
  getResidentRegionList('0', pageSize.value)
  const tHeight = tableRef.value.$el.offsetHeight
  tableHeight.value = window.innerHeight - tHeight - 150
  window.onresize = () => {
    return (() => {
      tableHeight.value = window.innerHeight - tHeight - 150
    })()
  }
})
const onBack = () => {
  back()
}
</script>

<style scoped></style>
