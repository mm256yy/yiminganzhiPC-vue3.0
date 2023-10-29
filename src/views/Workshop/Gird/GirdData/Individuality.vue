<template>
  <!-- 个人 -->
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="girdList">网格员列表</ElButton>
          <ElUpload
            action="/api/grid/importGrid"
            :headers="headers"
            :data="{ projectId }"
            :show-file-list="false"
            accept=".xls,.xlsx"
            :before-upload="beforeUpload"
            :on-success="uploadDone"
            :on-error="uploadError"
          >
            <template #trigger>
              <ElButton type="primary" :loading="uploadLoading">上传网格分配</ElButton>
            </template>
          </ElUpload>
          <ElButton type="primary" @click="onDownLoad">下载模板</ElButton>
        </ElSpace>
      </div>
      <Table
        selection
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #doorNo="{ row }">
          {{ filterViewDoorNo(row) }}
        </template>
        <template #regionText="{ row }">
          <div>
            {{
              `
              ${row.cityCodeText ? row.cityCodeText + '/' : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? '/' + row.townCodeText : ''}
              ${row.villageText ? '/' + row.villageText : ''}
              ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
              `
            }}
          </div>
        </template>
        <template #reportDate="{ row }">
          <div>{{ formatDate(row.reportDate) }}</div>
        </template>
        <template #gridmanName="{ row }">
          <div>{{ row.gridmanName == '0' ? '' : row.gridmanName }}</div>
        </template>
        <template #filling="{ row }">
          <div class="filling-btn" @click="adjust(row)">调整网络</div>
        </template>
      </Table>
    </div>
    <el-dialog title="分配员" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        请为已分配的{{ props.roleInfo }}，重新分配网格员
      </div>
      <ElFormItem label="所属网格员" prop="reason">{{
        tableObject.currentRow?.gridmanName
      }}</ElFormItem>
      <ElFormItem label="调整网格员" prop="reason">
        <ElSelect clearable filterable v-model="reason" class="!w-full">
          <ElOption
            v-for="item in girdLists"
            :key="item.value"
            :label="item.nickName"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>
  </WorkContentWrap>
  <GirdList :show="girdDialog" @close="onFormPupClose" />
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton,
  ElSpace,
  ElMessage,
  ElUpload
} from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { updateLandlordApi } from '@/api/AssetEvaluation/gird-service'
import { getLandlordListApi } from '@/api/AssetEvaluation/service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
// import type { LandlordHeadInfoType } from '@/api/workshop/landlord/types'
import { getLandlordListApiGird } from '@/api/AssetEvaluation/gird-service'
import { getGridExportApi } from '@/api/workshop/export/service'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import { filterViewDoorNo, formatDate } from '@/utils/index'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import GirdList from './Girdlist.vue'
const props = defineProps({
  roleInfo: { type: String, default: '' }
})
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const dialogVisible = ref(false)
const girdDialog = ref(false)
const reason = ref()
const uploadLoading = ref(false)

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})
const { setSearchParams } = methods

tableObject.params = {
  projectId,
  status: 'implementation'
}

// setSearchParams({ type: 'PeasantHousehold', status: SurveyStatusEnum.Implementation })
setSearchParams({ type: 'IndividualHousehold', status: 'implementation' })
const girdList = () => {
  girdDialog.value = true
}
const setAllocationStatus = (targ) => {
  setSearchParams({
    type: 'IndividualHousehold',
    status: SurveyStatusEnum.Implementation,
    allocationStatus: targ == 1 ? 1 : targ == 0 ? null : targ == 2 ? 0 : null
  })
}
defineExpose({ setAllocationStatus })
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'PeasantHousehold')
  villageTree.value = list || []
  return list || []
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const girdLists = ref<any>({})

const getList = async () => {
  const list = await getLandlordListApiGird({
    projectId,
    status: 'implementation'
  })
  girdLists.value = list.content
}
onMounted(() => {
  getVillageTree()
  getdistrictTree()
  getList()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: districtTree,
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
    field: 'name',
    label: '个体户名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入个体户名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入编号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'gridmanName',
    label: '网格员',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入网格员名称'
      }
    },
    table: {
      show: false
    }
  },

  // table字段 分割
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '个体户名称',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '编号',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'legalPersonName',
    label: '法人姓名',
    search: {
      show: false
    }
  },
  {
    field: 'regionText',
    label: '所属区域',
    width: 190,
    search: {
      show: false
    }
  },
  {
    field: 'regionText',
    label: '所在位置',
    search: {
      show: false
    }
  },
  {
    field: 'gridmanName',
    label: '网格员',
    search: {
      show: false
    }
  },
  {
    field: 'gridmanPhone',
    label: '网格员手机号',
    search: {
      show: false
    }
  },
  {
    field: 'filling',
    label: '操作',
    fixed: 'right',
    width: 115,
    search: {
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

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  if (!data.implementFillStatus) {
    Reflect.deleteProperty(params, 'implementFillStatus')
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  if (!params.hasPropertyAccount) {
    delete params.hasPropertyAccount
  }
  if (!params.fillStatus) {
    delete params.fillStatus
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      params.type = 'IndividualHousehold'
      params.status = SurveyStatusEnum.Implementation
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'IndividualHousehold'
    params.status = SurveyStatusEnum.Implementation
    setSearchParams({ ...params })
  }
}
const adjust = (row) => {
  dialogVisible.value = true
  tableObject.currentRow = row
}
const onClose = () => {
  dialogVisible.value = false
}
const onSubmit = () => {
  const params: any = {
    householdId: tableObject.currentRow?.id,
    gridmanId: reason.value
  }
  updateLandlordApi(params).then(() => {
    ElMessage.success('操作成功')
    setSearchParams({ type: 'IndividualHousehold', status: SurveyStatusEnum.Implementation })
  })
  dialogVisible.value = false
}
const onFormPupClose = () => {
  girdDialog.value = false
}
const onDownLoad = async () => {
  const res = await getGridExportApi({
    type: 'IndividualHousehold',
    status: SurveyStatusEnum.Implementation,
    sort: ['lastModifiedDate,id,desc'],
    projectId: projectId
  })
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
const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})
const beforeUpload = () => {
  uploadLoading.value = true
}

const uploadDone = () => {
  uploadLoading.value = false
  ElMessage({
    message: '正在导入，请等待批量导入结果',
    type: 'success'
  })
  setSearchParams({ type: 'Village', status: SurveyStatusEnum.Implementation })
}

const uploadError = (error) => {
  try {
    const response = JSON.parse(error.message)
    ElMessage.error(response.message)
    uploadLoading.value = false
  } catch (err) {
    console.log('导入报错信息:', err)
  }
}
</script>

<style lang="less" scoped>
.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.red {
  color: #ff3939;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}
</style>
