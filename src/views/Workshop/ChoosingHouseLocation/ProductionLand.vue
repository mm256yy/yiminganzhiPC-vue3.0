<!-- 生产用地 -->
<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">安置管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">选房择址</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">生产用地</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title">生产用地报表</div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <el-table
        v-loading="tableLoading"
        class="flex-col flex-1"
        :data="tableData"
        border
        :summary-method="getSummaries"
        style="width: 100%; max-height: 480px"
        height="480"
      >
        <el-table-column label="序号" type="index" align="center" width="80" />
        <el-table-column prop="villageCodeText" label="行政村" align="center" />
        <el-table-column prop="name" label="户主" align="center" />
        <el-table-column prop="showDoorNo" label="户号" align="center" />
        <el-table-column prop="settleAddressText" label="安置点" align="center" />
        <el-table-column prop="landNo" label="地块编号" align="center" />
        <el-table-column prop="landArea" label="土地面积（亩）" align="center" />
        <el-table-column prop="relocateArrangementStatus" label="确认状态" align="center" />
      </el-table>
      <!-- <p class="mt-[5px]">已选占比:&nbsp;{{ percent }}</p> -->
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
  getProductLandStatisticsApi,
  exportProductLandExportApi
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
const projectId = appStore.currentProjectId
const tableLoading = ref<boolean>()
const totalCountObj = ref<any>() // 总计对象
let extraParams = reactive({
  villageCode: undefined,
  doorNo: undefined,
  name: undefined
})
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
    field: 'showDoorNo',
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
  },
  {
    field: 'settleAddressText',
    label: '安置点',
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
    field: 'relocateArrangementStatus',
    label: '确认状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          { label: '已完成', value: 1 },
          { label: '未完成', value: 0 }
        ]
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
const tableData = ref([])
//百分比
const percent = ref()

//格式化百分比
const toPercent = (point) => Number(point * 100).toFixed(2) + '%'
//获取列表数据
const getProHouseReportList = () => {
  const params = {
    ...extraParams,
    page: pageNum.value - 1,
    size: pageSize.value,
    projectId
  }
  tableLoading.value = true
  getProductLandStatisticsApi(params).then(
    (res) => {
      tableData.value = res.content
      totalNum.value = res.total
      percent.value = toPercent(res.percent)
      totalCountObj.value = res.total
      tableLoading.value = false
    },
    (err) => {
      console.log(err)
      tableLoading.value = false
    }
  )
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getProHouseReportList()
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getProHouseReportList()
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
      3: totalCountObj.value.familyNumber, // 总人数
      4: totalCountObj.value.countAgriculture, // 农业安置
      5: totalCountObj.value.countRetirement, // 养老保险
      6: totalCountObj.value.countSelfEmployee // 自谋职业
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

getProHouseReportList()

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

  extraParams = {
    ...params
  }

  getProHouseReportList()
}

const onReset = () => {
  extraParams = {
    villageCode: undefined,
    doorNo: undefined,
    name: undefined
  }
  getProHouseReportList()
}

// 数据导出
const onExport = async () => {
  const params = {
    ...extraParams,
    projectId
  }
  const res = await exportProductLandExportApi(params)
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

onMounted(() => {
  getVillageTree()
})
</script>

<style scoped></style>
