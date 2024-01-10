<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">安置意愿报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">安置意愿</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">生产安置意愿</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
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
        <div class="table-left-title">生产安置意愿报表</div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <el-table
        class="flex-col flex-1"
        :data="tableData"
        border
        show-summary
        style="width: 100%; max-height: 480px"
        height="480"
      >
        <el-table-column label="序号" type="index" align="center" width="80" />
        <el-table-column prop="name" label="区域/户主" align="center" />
        <el-table-column prop="familyNumber" label="总人数(人)" align="center" />
        <el-table-column prop="countAgriculture" label="农业安置(人)" align="center" />
        <el-table-column prop="countRetirement" label="养老保险(人)" align="center" />
        <el-table-column prop="countSelfEmployee" label="自谋职业(人)" align="center" />
      </el-table>
      <p class="mt-[5px]">已选占比:&nbsp;{{ percent }}</p>
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
import { getProHouseReportListApi } from '@/api/workshop/placementReport/service'
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
// const { tableObject, methods } = useTable({
//   getListApi: getProHouseReportListApi
// })
// const { getList, setSearchParams } = methods
const tableData = ref([])
//百分比
const percent = ref()

//格式化百分比
const toPercent = (point) => Number(point * 100).toFixed(2) + '%'
//获取列表数据
const getProHouseReportList = (page, size) => {
  const params = {
    page: page,
    size: size
  }
  getProHouseReportListApi(params).then((res) => {
    tableData.value = res.reports.content
    totalNum.value = res.reports.total
    percent.value = toPercent(res.percent)
  })
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getProHouseReportList(pageNum.value - 1, pageSize.value)
}
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getProHouseReportList(pageNum.value - 1, pageSize.value)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

onMounted(() => {
  getVillageTree()
  getProHouseReportList('0', pageSize.value)
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

  getProHouseReportList('0', pageSize.value)
}

const onReset = () => {
  getProHouseReportList('0', pageSize.value)
}

// 数据导出
const onExport = () => {
  // const params = {
  //   exportType: '1',
  //   ...tableObject.params
  // }
  // const res = await exportReportApi(params)
  // let filename = res.headers
  // filename = filename['content-disposition']
  // filename = filename.split(';')[1].split('filename=')[1]
  // filename = decodeURIComponent(filename)
  // let elink = document.createElement('a')
  // document.body.appendChild(elink)
  // elink.style.display = 'none'
  // elink.download = filename
  // let blob = new Blob([res.data])
  // const URL = window.URL || window.webkitURL
  // elink.href = URL.createObjectURL(blob)
  // elink.click()
  // document.body.removeChild(elink)
  // URL.revokeObjectURL(elink.href)
}
</script>

<style scoped></style>
