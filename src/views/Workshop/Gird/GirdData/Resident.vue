<template>
  <!-- 居民 -->
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
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
        max-height="650"
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
        <template #hasPropertyAccount="{ row }">
          <div>{{ row.hasPropertyAccount ? '是' : '否' }}</div>
        </template>
        <template #gridmanName="{ row }">
          <div>{{ row.gridmanName == '0' ? '' : row.gridmanName }}</div>
        </template>
        <template #filling="{ row }">
          <div class="filling-btn" @click="adjust(row)">调整网格</div>
          <div class="filling-btn mt-10" @click="adjustDate(row)">调整节点时间</div>
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

    <el-dialog title="阶段时间设置" v-model="dialogVisibleDate" width="500">
      <ElFormItem label="资格认定" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[0].time"
          type="daterange"
          class="!w-full"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="资产评估" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[1].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="安置确认" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[2].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="择址确认" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[3].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="腾空过渡" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[4].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="动迁协议" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[5].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="搬迁安置" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[6].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem label="生产安置" prop="dateTime">
        <ElDatePicker
          v-model="dateTime[7].time"
          type="daterange"
          class="!w-full"
          placeholder="请选择"
          startPlaceholder="请选择开始时间"
          endPlaceholder="请选择结束时间"
          valueFormat="YYYY-MM-DD"
        />
      </ElFormItem>

      <template #footer>
        <ElButton @click="onCloseDate">取消</ElButton>
        <ElButton type="primary" @click="onSubmitDate">确认</ElButton>
      </template>
    </el-dialog>

    <GirdList :show="girdDialog" @close="onFormPupClose" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRaw } from 'vue'
import { useAppStore } from '@/store/modules/app'
import {
  ElDialog,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton,
  ElSpace,
  ElMessage,
  ElUpload,
  ElDatePicker
} from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { updateLandlordApi } from '@/api/AssetEvaluation/gird-service'
import { getLandlordListApi } from '@/api/AssetEvaluation/service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import { getLandlordListApiGird } from '@/api/AssetEvaluation/gird-service'
import { getGridExportApi } from '@/api/workshop/export/service'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import GirdList from './Girdlist.vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'

import { saveImplementationTimeApiList } from '@/api/systemConfig/implementationTime-service'
import { ImplementationTimeDtoType } from '@/api/systemConfig/implementationTime-types'
import { log } from 'console'

const props = defineProps({
  roleInfo: { type: String, default: '' }
})
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const dialogVisible = ref(false)
const dialogVisibleDate = ref(false)
const girdDialog = ref(false)
const dateTime = ref<any[]>([])
const doorNo = ref<string>('')
const reason = ref()
const uploadLoading = ref(false)

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId,
  status: 'implementation',
  isGrid: '1'
}

const girdList = () => {
  girdDialog.value = true
}
const setAllocationStatus = (targ) => {
  setSearchParams({
    type: 'PeasantHousehold',
    status: SurveyStatusEnum.Implementation,
    allocationStatus: targ == 1 ? 1 : targ == 0 ? null : targ == 2 ? '0' : null,
    isGrid: '1'
  })
}
defineExpose({ setAllocationStatus })
setSearchParams({
  type: 'PeasantHousehold',
  status: SurveyStatusEnum.Implementation,
  isGrid: '1'
})

const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'PeasantHousehold')
  villageTree.value = list || []
  return list || []
}

const onReset = () => {
  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  setSearchParams({
    type: 'PeasantHousehold',
    status: SurveyStatusEnum.Implementation,
    isGrid: '1'
  })
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const girdLists = ref<any>({})

const requestList = async () => {
  const list = await getLandlordListApiGird({
    projectId,
    status: 'implementation'
  })
  girdLists.value = list.content
}
onMounted(() => {
  getVillageTree()
  getdistrictTree()
  requestList()
})

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code == code) {
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
    label: '姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号'
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
    },
    fixed: 'left'
  },
  {
    field: 'name',
    label: '户主姓名',
    width: 80,
    search: {
      show: false
    },
    fixed: 'left'
  },
  {
    field: 'showDoorNo',
    label: '户号',
    width: 120,
    search: {
      show: false
    },
    fixed: 'left'
  },
  {
    field: 'regionText',
    label: '所属区域',
    width: 180,
    search: {
      show: false
    },
    fixed: 'left'
  },
  {
    field: 'hasPropertyAccount',
    label: '财产户',
    width: 80,
    search: {
      show: false
    }
  },
  {
    field: 'locationTypeText',
    label: '所在位置',
    width: 150,
    search: {
      show: false
    }
  },
  {
    field: 'gridmanName',
    label: '网格员',
    width: 150,
    search: {
      show: false
    }
  },
  {
    field: 'gridmanPhone',
    label: '网格员手机号',
    width: 150,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'zgrdDateInterval',
    label: '资格认定起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'zcpgDateInterval',
    label: '资产评估起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'azqrDateInterval',
    label: '安置确认起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'zzqrDateInterval',
    label: '择址确认起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'tkgdDateInterval',
    label: '腾空过渡起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'dqxyDateInterval',
    label: '动迁协议起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'bqazDateInterval',
    label: '搬迁安置起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'scazDateInterval',
    label: '生产安置起止时间',
    width: 250,
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'filling',
    label: '操作',
    fixed: 'right',
    width: 130,
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  params[getParamsKey('Country')] = null
  params[getParamsKey('Township')] = null
  params[getParamsKey('Village')] = null
  params[getParamsKey('NaturalVillage')] = null
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      tableObject.params = {
        ...params
      }
      setSearchParams({
        type: 'PeasantHousehold',
        status: SurveyStatusEnum.Implementation,
        isGrid: '1'
      })
    })
  } else {
    tableObject.params = {
      ...params
    }
    setSearchParams({
      type: 'PeasantHousehold',
      status: SurveyStatusEnum.Implementation,
      isGrid: '1'
    })
  }
}

const adjust = (row) => {
  dialogVisible.value = true
  tableObject.currentRow = row
}
const onClose = () => {
  dialogVisible.value = false
}
const adjustDate = (row) => {
  dateTime.value = row.scheduleConfigs || []
  doorNo.value = row.doorNo

  console.log(row.scheduleConfigs, toRaw(dateTime.value))

  for (var a = 0; a < 8; a++) {
    toRaw(dateTime.value)[a] = {
      ...toRaw(dateTime.value)[a],
      time: [toRaw(dateTime.value)[a]?.startTime || '', toRaw(dateTime.value)[a]?.endTime || '']
    }
  }

  dialogVisibleDate.value = true
}
const onCloseDate = () => {
  dialogVisibleDate.value = false
}
const onSubmitDate = () => {
  const arr = ['1', '2', '3', '4', '5', '6', '7', '8']
  for (var a = 0; a < arr.length; a++) {
    toRaw(dateTime.value)[a] = {
      ...toRaw(dateTime.value)[a],
      doorNo: doorNo.value,
      type: arr[a],
      startTime: toRaw(dateTime.value)[a].time?.[0] || '',
      endTime: toRaw(dateTime.value)[a].time?.[1] || ''
    }
  }
  saveImplementationTimeApiList(toRaw(dateTime.value))
    .then((res) => {
      if (res) {
        ElMessage.success('操作成功')
        dialogVisibleDate.value = false
        onSearch({})
      }
    })
    .catch(() => {
      ElMessage.success('操作失败')
    })
}
const onSubmit = () => {
  const params: any = {
    householdId: tableObject.currentRow?.id,
    gridmanId: reason.value
  }
  updateLandlordApi(params).then(() => {
    ElMessage.success('操作成功')
    getList()
  })
  dialogVisible.value = false
}
const onFormPupClose = () => {
  girdDialog.value = false
}
const onDownLoad = async () => {
  const res = await getGridExportApi({
    type: 'PeasantHousehold',
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
  setSearchParams({
    type: 'PeasantHousehold',
    status: SurveyStatusEnum.Implementation,
    isGrid: '1'
  })
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
  // width: 80px;
  width: 100px;
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
.mt-10 {
  margin-top: 10px;
}
:deep(.el-scrollbar__bar) {
  text-align: center;
}
</style>
