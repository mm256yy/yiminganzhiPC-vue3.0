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
        <ElBreadcrumbItem class="text-size-12px">工作组统计</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 居民户工作组统计报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <el-table :data="tableData" border style="width: 100%; max-height: 600px" height="600">
        <el-table-column label="序号" type="index" align="center" width="80" />
        <el-table-column prop="gridmanName" label="工作组" align="center" />
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
            <el-table-column prop="appendageStatusCount" label="房屋/附属物" align="center" />
            <el-table-column prop="landStatusCount" label="土地/附着物" align="center" />
          </el-table-column>

          <el-table-column label="安置确认" align="center">
            <el-table-column
              prop="productionArrangementStatusCount"
              label="生产安置"
              align="center"
            />

            <el-table-column
              prop="relocateArrangementStatusCount"
              label="搬迁安置"
              align="center"
            />

            <el-table-column prop="graveArrangementStatusCount" label="坟墓确认" align="center" />
          </el-table-column>

          <el-table-column label="择址确认" align="center">
            <el-table-column prop="landUseStatusCount" label="生产用地" align="center" />
            <el-table-column prop="chooseHouseStatusCount" label="选房择址" align="center" />
            <el-table-column prop="chooseGraveStatusCount" label="坟墓择址" align="center" />
          </el-table-column>
          <el-table-column label="腾空过渡" align="center">
            <el-table-column prop="houseSoarStatusCount" label="房屋腾空" align="center" />
            <el-table-column prop="landSoarStatusCount" label="土地腾让" align="center" />
            <el-table-column prop="excessStatusCount" label="过渡安置" align="center" />
          </el-table-column>
          <el-table-column prop="agreementStatusCount" label="动迁协议" align="center" />
        </el-table-column>
        <el-table-column label="安置阶段(户)" align="center">
          <el-table-column label="搬迁安置" align="center">
            <el-table-column
              prop="buildOneselfStatusCount"
              label="自建房"
              align="center"
              width="120"
            />

            <el-table-column prop="flatsStatusCount" label="公寓房" align="center" width="120" />
            <el-table-column
              prop="centralizedSupportStatusCount"
              label="集中供养"
              align="center"
              width="120"
            />
            <el-table-column
              prop="selfSeekingStatusCount"
              label="自谋出路"
              align="center"
              width="120"
            />
          </el-table-column>

          <el-table-column label="生产安置" align="center">
            <el-table-column
              prop="agricultureArrangementStatusCount"
              label="农业安置"
              align="center"
              width="120"
            />

            <el-table-column
              prop="retirementStatusCount"
              label="养老保险"
              align="center"
              width="120"
            />
            <el-table-column
              prop="selfEmploymentStatusCount"
              label="自谋职业"
              align="center"
              width="120"
            />
          </el-table-column>
          <el-table-column
            prop="proceduresStatusCount"
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
import { getResidentWorkListApi, exportWorkGroupApi } from '@/api/workshop/scheduleReport/service'
import { useAppStore } from '@/store/modules/app'

const { back } = useRouter()
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const pageSize = ref(10)
const pageNum = ref(1)
const totalNum = ref(0)
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'name',
    label: '工作组',
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
const tableData = ref([])

const { tableObject } = useTable()

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getResidentWorkList()
}

const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getResidentWorkList()
}

//查询报表数据
const getResidentWorkList = () => {
  const params = {
    ...tableObject.params,
    page: pageNum.value - 1,
    size: pageSize.value
  }
  getResidentWorkListApi(params).then((res) => {
    tableData.value = res.content
    totalNum.value = res.total
  })
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params,
    type: 'PeasantHousehold'
  }
  const res = await exportWorkGroupApi(params)
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  tableObject.params = params
  getResidentWorkList()
}

const onReset = () => {
  tableObject.params = {}
  getResidentWorkList()
}

onMounted(() => {
  getResidentWorkList()
})
const onBack = () => {
  back()
}
</script>

<style scoped></style>
