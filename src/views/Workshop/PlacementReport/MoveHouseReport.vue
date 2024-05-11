<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">安置意愿报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">安置意愿</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">搬迁安置意愿</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 搬迁安置意愿报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%; max-height: 580px"
        height="580"
      >
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column
          prop="villageCodeText"
          label="行政村"
          align="center"
          show-overflow-tooltip
        />
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
            <el-table-column prop="homesteadTC1AreaCount" label="48" align="center" width="50" />
            <el-table-column prop="homesteadTC2AreaCount" label="72" align="center" width="50" />
            <el-table-column prop="homesteadTC3AreaCount" label="96" align="center" width="50" />
            <el-table-column prop="homesteadTC4AreaCount" label="120" align="center" width="50" />
            <el-table-column prop="homesteadTC5AreaCount" label="144" align="center" width="50" />
            <el-table-column prop="homesteadTC6AreaCount" label="168" align="center" width="50" />
          </el-table-column>
          <el-table-column label="麻家田安置区" align="center">
            <el-table-column prop="homesteadMJT1AreaCount" label="48" align="center" width="50" />
            <el-table-column prop="homesteadMJT2AreaCount" label="72" align="center" width="50" />
            <el-table-column prop="homesteadMJT3AreaCount" label="96" align="center" width="50" />
            <el-table-column prop="homesteadMJT4AreaCount" label="120" align="center" width="50" />
            <el-table-column prop="homesteadMJT5AreaCount" label="144" align="center" width="50" />
            <el-table-column prop="homesteadMJT6AreaCount" label="168" align="center" width="50" />
          </el-table-column>
          <el-table-column label="东坪安置区" align="center">
            <el-table-column prop="homesteadDP1AreaCount" label="48" align="center" width="50" />
            <el-table-column prop="homesteadDP2AreaCount" label="72" align="center" width="50" />
            <el-table-column prop="homesteadDP3AreaCount" label="96" align="center" width="50" />
            <el-table-column prop="homesteadDP4AreaCount" label="120" align="center" width="50" />
            <el-table-column prop="homesteadDP5AreaCount" label="144" align="center" width="50" />
            <el-table-column prop="homesteadDP6AreaCount" label="168" align="center" width="50" />
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
      <p class="w-[120px] text-center text-[14px] mt-[10px]">已选占比:{{ percent }}</p>
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
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import {
  getMoveHouseReportListApi,
  exportMoveHouseReportApi,
  getMoveHouseReportListTitleApi
} from '@/api/workshop/placementReport/service'
import { screeningTree } from '@/api/workshop/village/service'
import { useAppStore } from '@/store/modules/app'

const { back } = useRouter()
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const pageSize = ref(10)
const pageNum = ref(1)
const totalNum = ref(0)
const villageTree = ref<any[]>([])
const appStore = useAppStore()
const tableLoading = ref<boolean>()
const totalCountObj = ref<any>() // 总计对象
let extraParams = reactive({
  villageCode: undefined,
  doorNo: undefined,
  name: undefined
})
const projectId = appStore.currentProjectId
const title = ref<any>()

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
    label: '户主姓名',
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
const tableData = ref<any>([])
const percent = ref() //已选占比

// 数据导出
const onExport = async () => {
  const params = {
    ...extraParams
  }
  const res = await exportMoveHouseReportApi(params)
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

const getMoveHouseReportList = () => {
  const params = {
    ...extraParams,
    page: pageNum.value - 1,
    size: pageSize.value,
    projectId
  }
  tableLoading.value = true
  getMoveHouseReportListApi(params).then((res) => {
    tableData.value = res.reports.content
    percent.value = toPercent(res.percent)
    totalNum.value = res.reports.total
    totalCountObj.value = res.total
    tableLoading.value = false
  })
}

const getMoveHouseReportListTitle = () => {
  getMoveHouseReportListTitleApi().then((res) => {
    title.value = res.title
  })
}

const toPercent = (point) => Number(point * 100).toFixed(2) + '%'

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

const getSummaries = (params: any) => {
  const { columns } = params
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = '合计'
      return
    }
    if (index < 3) {
      sums[index] = ''
      return
    }
    console.log(column)
    if (!totalCountObj.value) {
      return
    }
    const totalMap = {
      3: totalCountObj.value.flatSG7Count,
      4: totalCountObj.value.flatSG9Count,
      5: totalCountObj.value.flatSG11Count,
      6: totalCountObj.value.flatSG13Count,
      7: totalCountObj.value.flatJL7Count,
      8: totalCountObj.value.flatJL9Count,
      9: totalCountObj.value.flatJL11Count,
      10: totalCountObj.value.flatJL13Count,
      11: totalCountObj.value.homesteadTC1AreaCount,
      12: totalCountObj.value.homesteadTC2AreaCount,
      13: totalCountObj.value.homesteadTC3AreaCount,
      14: totalCountObj.value.homesteadTC4AreaCount,
      15: totalCountObj.value.homesteadTC5AreaCount,
      16: totalCountObj.value.homesteadTC6AreaCount,
      17: totalCountObj.value.homesteadMJT1AreaCount,
      18: totalCountObj.value.homesteadMJT2AreaCount,
      19: totalCountObj.value.homesteadMJT3AreaCount,
      20: totalCountObj.value.homesteadMJT4AreaCount,
      21: totalCountObj.value.homesteadMJT5AreaCount,
      22: totalCountObj.value.homesteadMJT6AreaCount,
      23: totalCountObj.value.homesteadDP1AreaCount,
      24: totalCountObj.value.homesteadDP2AreaCount,
      25: totalCountObj.value.homesteadDP3AreaCount,
      26: totalCountObj.value.homesteadDP4AreaCount,
      27: totalCountObj.value.homesteadDP4AreaCount,
      28: totalCountObj.value.homesteadDP5AreaCount,
      29: totalCountObj.value.homesteadDP6AreaCount,
      30: totalCountObj.value.oneselfCount,
      31: totalCountObj.value.concentrateCount
    }
    sums[index] = totalMap[index]
    return
  })
  return sums
}

getMoveHouseReportList()
getMoveHouseReportListTitle()
onMounted(() => {
  getVillageTree()
})

const onBack = () => {
  back()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMoveHouseReportList()
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getMoveHouseReportList()
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

  extraParams = {
    ...params
  }

  getMoveHouseReportList()
}

const onReset = () => {
  extraParams = {
    villageCode: undefined,
    doorNo: undefined,
    name: undefined
  }
  getMoveHouseReportList()
}
</script>

<style scoped></style>
