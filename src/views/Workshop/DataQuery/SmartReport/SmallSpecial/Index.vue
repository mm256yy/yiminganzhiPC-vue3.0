<!--小型专项及农副业设施-->
<template>
  <MigrateCrumb :titles="titles" />
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="resetSearch"
      />
    </div>

    <div class="line"></div>
    <div class="table-wrap" v-loading="loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 小型专项及农副业设施统计表 </div>
        <ElButton type="primary" @click="onExport">数据导出</ElButton>
      </div>
      <el-table :data="tableData" style="width: 100%" height="650">
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column prop="villageName" label="行政村" show-overflow-tooltip />
        <el-table-column prop="name" label="村集体名称" show-overflow-tooltip />
        <el-table-column prop="facilitiesCode" label="设施编号" show-overflow-tooltip />
        <el-table-column prop="facilitiesType" label="设施类别" show-overflow-tooltip />
        <el-table-column prop="facilitiesName" label="设施名称" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" show-overflow-tooltip />
        <el-table-column prop="number" label="数量" show-overflow-tooltip />
        <el-table-column prop="locationType" label="所在位置" />
        <el-table-column prop="specificLocation" label="具体位置" />
        <el-table-column prop="competentUnit" label="主管单位" />
        <el-table-column prop="completedTime" label="建成年月">
          <template #default="scope">
            <span>{{
              scope.row.completedTime ? dayjs(scope.row.completedTime).format('YYYY-MM') : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="scopes" label="规模" />
        <el-table-column prop="benefit" label="效益" />
        <el-table-column prop="cost" label="固定资产原值（万元）" />
        <el-table-column prop="netBal" label="固定资产净值（万元）" />
        <el-table-column prop="workersNum" label="职工人数" />
        <el-table-column prop="originalInvest" label="原投资" />
      </el-table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getFacilitiesListApi,
  exportFacilitiesApi
} from '@/api/workshop/dataQuery/outcomeChange-service'
import { screeningTree } from '@/api/workshop/village/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
import dayjs from 'dayjs'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const titles = ['智能报表', '实物成果', '村集体', '小型专项及农副业设施']

const tableData = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)
let searchParams = reactive({
  villageCode: undefined,
  villageName: undefined,
  facilitiesName: undefined
})

const schema = reactive<CrudSchema[]>([
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
        }
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'villageName',
    label: '请输入村集体名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户主名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'facilitiesName',
    label: '设施名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入设施名称'
      }
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

/**
 * 获取表格数据
 */
const getTableList = () => {
  const params = getSearchParams()
  loading.value = true
  getFacilitiesListApi(params)
    .then((res: any) => {
      if (res) {
        tableData.value = res
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const getSearchParams = () => {
  return {
    ...searchParams,
    size: 99999,
    page: 0
  }
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

  searchParams = { ...params }
  getTableList()
}

// 重置
const resetSearch = () => {
  searchParams = {} as any
  getTableList()
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'village')
  villageTree.value = list || []
  return list || []
}

// 导出
const onExport = async () => {
  const res = await exportFacilitiesApi(getSearchParams())
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
  getTableList()
})
</script>
<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  justify-content: space-between;
}

.table-wrap {
  margin-top: 0;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
