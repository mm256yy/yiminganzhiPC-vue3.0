<!--按附属物变更-->
<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="resetSearch"
      />
      <ElButton type="primary" @click="onExport">导出</ElButton>
    </div>

    <div class="line"></div>
    <div class="table-wrap" v-loading="loading">
      <el-table :data="tableData" style="width: 100%" height="650">
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="showDoorNo" label="户号" show-overflow-tooltip />
        <el-table-column prop="householder" label="户主" show-overflow-tooltip />
        <el-table-column prop="area" label="所属区域" show-overflow-tooltip />
        <el-table-column prop="operation" label="操作" width="250" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" text @click="handleCollection(scope.row)"
              >查看采集成果</el-button
            >
            <el-button size="small" type="primary" text @click="handleReviewers(scope.row)"
              >查看复核成果</el-button
            >
          </template>
        </el-table-column>
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
  getPhysicalChangesListApi,
  getChangeExport
} from '@/api/workshop/dataQuery/outcomeChange-service'
import type { OutcomeChangeDtoType } from '@/api/workshop/dataQuery/outcomeChange-types'
import { screeningTree } from '@/api/workshop/village/service'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const { push } = useRouter()

const tableData = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)
let searchParams = reactive({
  area: undefined,
  doorNo: undefined,
  householder: undefined
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'area',
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
        flat: true
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householder',
    label: '户主',
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
    field: 'showDoorNo',
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
  getPhysicalChangesListApi(params)
    .then((res: OutcomeChangeDtoType[]) => {
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
    type: '3',
    pId: projectId,
    ...searchParams
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
  searchParams = {
    area: undefined,
    doorNo: undefined,
    householder: undefined
  }
  getTableList()
}

// 查看采集人员
const handleCollection = (row: any) => {
  push({
    name: 'Collection',
    query: {
      name: row.urlParamName,
      householdId: row.urlParamHouseholdId,
      doorNo: row.urlParamDoorNo,
      type: 'Landlord',
      classifyType: 'check'
    }
  })
}

// 查看复核人员
const handleReviewers = (row: any) => {
  push({
    name: 'DataFillCheck',
    query: {
      name: row.urlParamName,
      householdId: row.urlParamHouseholdId,
      doorNo: row.urlParamDoorNo,
      type: 'Landlord',
      classifyType: 'check'
    }
  })
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'village')
  villageTree.value = list || []
  return list || []
}

// 导出
const onExport = async () => {
  const res = await getChangeExport(getSearchParams())
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
