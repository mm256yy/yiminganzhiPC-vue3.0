<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">进度管理</ElBreadcrumbItem>
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
      <el-table :data="tableData" border :span-method="objectSpanMethod" style="width: 100%">
        <el-table-column prop="number" label="序号" align="center" />
        <el-table-column prop="doorNo" label="户号" align="center" />
        <el-table-column prop="name" label="户主" align="center" />
        <!-- 公寓房 -->
        <el-table-column label="动迁阶段(户)" align="center">
          <el-table-column label="资格认定" align="center">
            <el-table-column prop="populationStatus" label="人口核定" align="center" width="90">
              <template #default="{ row }">
                <Icon
                  v-if="row.populationStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="propertyStatus" label="房屋产权" align="center" width="90">
              <template #default="{ row }">
                <Icon
                  v-if="row.propertyStatus == '1' && row.number !== '合计'"
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
                  v-if="row.appendageStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="landStatus" label="土地/附着物" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.landStatus == '1' && row.number !== '合计'"
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
                  v-if="row.productionArrangementStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>

            <el-table-column prop="relocateArrangementStatus" label="搬迁安置" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.relocateArrangementStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>

            <el-table-column prop="graveArrangementStatus" label="坟墓确认" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.graveArrangementStatus == '1' && row.number !== '合计'"
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
                  v-if="row.landUseStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="chooseHouseStatus" label="选房择址" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.chooseHouseStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="chooseGraveStatus" label="坟墓择址" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.chooseGraveStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="cardStatus" label="移民建卡" align="center">
            <template #default="{ row }">
              <Icon
                v-if="row.cardStatus == '1' && row.number !== '合计'"
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
                  v-if="row.houseSoarStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="landSoarStatus" label="土地腾让" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.landSoarStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="excessStatus" label="过渡安置" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.excessStatus == '1' && row.number !== '合计'"
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
                v-if="row.agreementStatus == '1' && row.number !== '合计'"
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
                  v-if="row.buildOneselfStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>

            <el-table-column prop="flatsStatus" label="公寓房" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.flatsStatus == '1' && row.number !== '合计'"
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
                  v-if="row.centralizedSupportStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
              </template>
            </el-table-column>
            <el-table-column prop="selfSeekingStatus" label="自谋出路" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.selfSeekingStatus == '1' && row.number !== '合计'"
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
                  v-if="row.aricutureArrangementStatus == '1' && row.number !== '合计'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                /> </template
            ></el-table-column>

            <el-table-column prop="retirementStatus" label="养老保险" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.retirementStatus == '1' && row.number !== '合计'"
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
                  v-if="row.selfEmploymentStatus == '1' && row.number !== '合计'"
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
                v-if="row.proceduresStatus == '1' && row.number !== '合计'"
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
const tableData = ref<any>([])

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
    tableData.value.forEach((item, index) => {
      item.number = index + 1
    })
    //添加合计行

    if (tableData.value.length >= 1) {
      tableData.value.push({
        number: '合计',
        populationStatus: totalColumn(tableData.value, 'populationStatus'),
        propertyStatus: totalColumn(tableData.value, 'propertyStatus'),
        appendageStatus: totalColumn(tableData.value, 'appendageStatus'),
        landStatus: totalColumn(tableData.value, 'landStatus'),
        productionArrangementStatus: totalColumn(tableData.value, 'productionArrangementStatus'),
        relocateArrangementStatus: totalColumn(tableData.value, 'relocateArrangementStatus'),
        graveArrangementStatus: totalColumn(tableData.value, 'graveArrangementStatus'),
        landUseStatus: totalColumn(tableData.value, 'landUseStatus'),
        chooseHouseStatus: totalColumn(tableData.value, 'chooseHouseStatus'),
        chooseGraveStatus: totalColumn(tableData.value, 'chooseGraveStatus'),
        cardStatus: totalColumn(tableData.value, 'cardStatus'),
        houseSoarStatus: totalColumn(tableData.value, 'houseSoarStatus'),
        landSoarStatus: totalColumn(tableData.value, 'landSoarStatus'),
        excessStatus: totalColumn(tableData.value, 'excessStatus'),
        agreementStatus: totalColumn(tableData.value, 'agreementStatus'),
        buildOneselfStatus: totalColumn(tableData.value, 'buildOneselfStatus'),
        flatsStatus: totalColumn(tableData.value, 'flatsStatus'),
        centralizedSupportStatus: totalColumn(tableData.value, 'centralizedSupportStatus'),
        selfSeekingStatus: totalColumn(tableData.value, 'selfSeekingStatus'),
        aricutureArrangementStatus: totalColumn(tableData.value, 'aricutureArrangementStatus'),
        retirementStatus: totalColumn(tableData.value, 'retirementStatus'),
        selfEmploymentStatus: totalColumn(tableData.value, 'selfEmploymentStatus'),
        proceduresStatus: totalColumn(tableData.value, 'proceduresStatus')
      })
    }

    totalNum.value = res.total
  })
}

//完成状态合计
const totalColumn = (arr, key) => {
  let s = 0
  arr.forEach((item) => {
    const num = item[key] == '1' ? 1 : 0
    if (!isNaN(num)) {
      s += num
    }
  })
  return s
}
//合并合计户单元格
const objectSpanMethod = ({ row, columnIndex }: any) => {
  if (row.number === '合计') {
    if (columnIndex == 0) {
      return {
        rowspan: 1,
        colspan: 3
      }
    }
    if (columnIndex == 1 || columnIndex == 2) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
/**
 * 计算 table 的高度
 * @param arr 当前 table 的数据
 */
// const getHeight = (arr: any) => {
//   if (arr.length === 0) {
//     return 150
//   } else if (arr.length > 9) {
//     return 500
//   } else {
//     return 'auto'
//   }
// }
onMounted(() => {
  getResidentRegionList('0', pageSize.value)
})
const onBack = () => {
  back()
}
</script>

<style scoped></style>
