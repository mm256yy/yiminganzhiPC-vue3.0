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
        <el-table-column
          :label="item.fieldName"
          align="center"
          width="80"
          v-for="(item, index) in title"
          :key="index"
          :prop="item.fieldValue"
        >
          <template v-if="item.children">
            <el-table-column
              v-for="(item2, index2) in item.children"
              :key="index2"
              :prop="item2.prop"
              :label="item2.fieldName"
              align="center"
            >
              <template v-if="item2.children">
                <el-table-column
                  :label="item3.fieldName"
                  :prop="item3.fieldValue"
                  align="center"
                  width="80"
                  v-for="(item3, index) in item2.children"
                  :key="index"
                />
              </template>
            </el-table-column>
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
  console.log(11111)
  getMoveHouseReportListTitleApi().then((res) => {
    title.value = res
    console.log(title.value, '表头')
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
      3: totalCountObj.value.hasOwnProperty('flat_5_70') ? totalCountObj.value.flat_5_70 : 0,
      4: totalCountObj.value.hasOwnProperty('flat_5_90') ? totalCountObj.value.flat_5_90 : 0,
      5: totalCountObj.value.hasOwnProperty('flat_5_110') ? totalCountObj.value.flat_5_110 : 0,
      6: totalCountObj.value.hasOwnProperty('flat_5_130') ? totalCountObj.value.flat_5_130 : 0,
      7: totalCountObj.value.hasOwnProperty('flat_6_70') ? totalCountObj.value.flat_6_70 : 0,
      8: totalCountObj.value.hasOwnProperty('flat_6_90') ? totalCountObj.value.flat_6_90 : 0,
      9: totalCountObj.value.hasOwnProperty('flat_6_110') ? totalCountObj.value.flat_6_110 : 0,
      10: totalCountObj.value.hasOwnProperty('flat_6_130') ? totalCountObj.value.flat_6_130 : 0,
      11: totalCountObj.value.hasOwnProperty('homestead_2_1')
        ? totalCountObj.value.homestead_2_1
        : 0,
      12: totalCountObj.value.hasOwnProperty('homestead_2_2')
        ? totalCountObj.value.homestead_2_2
        : 0,
      13: totalCountObj.value.hasOwnProperty('homestead_2_3')
        ? totalCountObj.value.homestead_2_3
        : 0,
      14: totalCountObj.value.hasOwnProperty('homestead_2_4')
        ? totalCountObj.value.homestead_2_4
        : 0,
      15: totalCountObj.value.hasOwnProperty('homestead_2_5')
        ? totalCountObj.value.homestead_2_5
        : 0,
      16: totalCountObj.value.hasOwnProperty('homestead_2_6')
        ? totalCountObj.value.homestead_2_6
        : 0,
      17: totalCountObj.value.hasOwnProperty('homestead_3_1')
        ? totalCountObj.value.homestead_3_1
        : 0,
      18: totalCountObj.value.hasOwnProperty('homestead_3_2')
        ? totalCountObj.value.homestead_3_2
        : 0,
      19: totalCountObj.value.hasOwnProperty('homestead_3_3')
        ? totalCountObj.value.homestead_3_3
        : 0,
      20: totalCountObj.value.hasOwnProperty('homestead_3_4')
        ? totalCountObj.value.homestead_3_4
        : 0,
      21: totalCountObj.value.hasOwnProperty('homestead_3_5')
        ? totalCountObj.value.homestead_3_5
        : 0,
      22: totalCountObj.value.hasOwnProperty('homestead_3_6')
        ? totalCountObj.value.homestead_3_6
        : 0,
      // 23: totalCountObj.value.homesteadDP1AreaCount,
      // 24: totalCountObj.value.homesteadDP2AreaCount,
      // 25: totalCountObj.value.homesteadDP3AreaCount,
      // 26: totalCountObj.value.homesteadDP4AreaCount,
      // 27: totalCountObj.value.homesteadDP4AreaCount,
      // 28: totalCountObj.value.homesteadDP5AreaCount,
      // 29: totalCountObj.value.homesteadDP6AreaCount,
      23: totalCountObj.value.hasOwnProperty('oneselfCount') ? totalCountObj.value.oneselfCount : 0,
      24: totalCountObj.value.hasOwnProperty('concentrateCount')
        ? totalCountObj.value.concentrateCount
        : 0
    }
    sums[index] = totalMap[index]
    return
  })
  return sums
}

getMoveHouseReportList()
onMounted(() => {
  getVillageTree()
  getMoveHouseReportListTitle()
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
