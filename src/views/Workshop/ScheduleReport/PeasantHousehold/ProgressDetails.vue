<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">进度统计表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">居民户</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">进度明细</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 居民户进度明细报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; max-height: 600px"
        height="600"
      >
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column prop="villageCodeText" label="行政村" align="center" />
        <el-table-column prop="showDoorNo" label="户号" align="center" />
        <el-table-column prop="name" label="户主" align="center" />
        <!-- 公寓房 -->
        <el-table-column label="动迁阶段(户)" align="center">
          <el-table-column label="资格认定" align="center">
            <el-table-column prop="populationStatus" label="人口核定" align="center" width="90">
              <template #default="{ row }">
                <Icon
                  v-if="row.populationStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
                <div e-else></div>
              </template>
            </el-table-column>
            <el-table-column prop="propertyStatus" label="房屋产权" align="center" width="90">
              <template #default="{ row }">
                <Icon
                  v-if="row.propertyStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
                <div e-else></div> </template
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
                <div e-else></div>
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
                <div v-else></div>
                <div e-else></div>
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
                <div v-else></div>
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
                <div v-else></div>
              </template>
            </el-table-column>

            <el-table-column prop="graveArrangementStatus" label="坟墓确认" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.graveArrangementStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
                <div v-else></div>
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
                <div v-else></div>
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
                <div v-else></div>
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
                <div v-else></div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="cardStatus" label="移民建卡" align="center">
            <template #default="{ row }">
              <Icon
                v-if="row.cardStatus === '1'"
                class="active-icon"
                icon="ep:check"
                color="#000"
              />
              <div v-else></div>
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
                <div v-else></div>
              </template>
            </el-table-column>
            <el-table-column prop="landSoarStatus" label="土地腾让" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.landSoarStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
                <div v-else></div>
              </template>
            </el-table-column>
            <el-table-column prop="excessStatus" label="过渡安置" align="center">
              <template #default="{ row }">
                <Icon
                  v-if="row.excessStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
                <div v-else></div>
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
              <div v-else></div>
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
                <div v-else></div>
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
                <div v-else></div>
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
                <div v-else></div>
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
                <div v-else></div>
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
                />
                <div v-else></div> </template
            ></el-table-column>

            <el-table-column prop="retirementStatus" label="养老保险" align="center" width="120">
              <template #default="{ row }">
                <Icon
                  v-if="row.retirementStatus == '1'"
                  class="active-icon"
                  icon="ep:check"
                  color="#000"
                />
                <div v-else></div> </template
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
                <div v-else></div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="proceduresStatus" label="相关手续" align="center" width="120">
            <template #default="{ row }">
              <Icon
                v-if="row.proceduresStatus == '1'"
                class="active-icon"
                icon="ep:check"
                color="#000"
              />
              <div v-else></div>
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
import { reactive, ref, onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import {
  getResidentProgressListApi,
  exportProgressDetailApi
} from '@/api/workshop/scheduleReport/service'
import { screeningTree } from '@/api/workshop/village/service'
import { useAppStore } from '@/store/modules/app'

const { back } = useRouter()
const villageTree = ref<any[]>([])
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const pageSize = ref(10)
const pageNum = ref(1)
const totalNum = ref(0)
const tableLoading = ref<boolean>(false)
const totalCountObj = ref<any>() // 总计对象

const { tableObject } = useTable()
const tableData = ref<any>([])
const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'villageCode',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: villageTree,
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
    label: '户号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户号'
      }
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
    label: '户主姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户主姓名'
      }
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
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getResidentRegionList()
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getResidentRegionList()
}
//查询报表数据
const getResidentRegionList = () => {
  const params = {
    ...tableObject.params,
    page: pageNum.value - 1,
    size: pageSize.value
  }
  tableLoading.value = true
  getResidentProgressListApi(params).then(
    (res) => {
      tableData.value = res.content
      totalNum.value = res.total
      totalCountObj.value = res.other
      tableLoading.value = false
    },
    (err) => {
      console.log(err)
      tableLoading.value = false
    }
  )
}

const getSummaries = (params: any) => {
  const { columns } = params
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (index < 4) {
      sums[index] = ''
      return
    }
    console.log(column)
    if (!totalCountObj.value) {
      return
    }
    const totalMap = {
      4: totalCountObj.value.populationStatusTotal,
      5: totalCountObj.value.propertyStatusTotal,
      6: totalCountObj.value.appendageStatusTotal,
      7: totalCountObj.value.landSeedlingStatusTotal,
      8: totalCountObj.value.productionArrangementStatusTotal,
      9: totalCountObj.value.relocateArrangementStatusTotal,
      10: totalCountObj.value.graveArrangementStatusTotal,
      11: totalCountObj.value.landUseStatusTotal,
      12: totalCountObj.value.chooseHouseStatusTotal,
      13: totalCountObj.value.chooseGraveStatusTotal,
      14: totalCountObj.value.cardStatusTotal,
      15: totalCountObj.value.houseSoarStatusTotal,
      16: totalCountObj.value.landSoarStatusTotal,
      17: totalCountObj.value.excessStatusTotal,
      18: totalCountObj.value.agreementStatusTotal,
      19: totalCountObj.value.buildOneselfStatusTotal,
      20: totalCountObj.value.flatsStatusTotal,
      21: totalCountObj.value.centralizedSupportStatusTotal,
      22: totalCountObj.value.selfSeekingStatusTotal,
      23: totalCountObj.value.agricultureArrangementStatusTotal,
      24: totalCountObj.value.retirementStatusTotal,
      25: totalCountObj.value.selfEmploymentStatusTotal,
      26: totalCountObj.value.proceduresStatusTotal
    }
    sums[index] = totalMap[index]
    return
  })
  return sums
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

getResidentRegionList()

onMounted(() => {
  getVillageTree()
})
const onBack = () => {
  back()
}

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

  tableObject.params = params
  getResidentRegionList()
}

const onReset = () => {
  tableObject.params = {}
  getResidentRegionList()
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params,
    type: 'PeasantHousehold'
  }
  const res = await exportProgressDetailApi(params)
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
</script>

<style scoped></style>
