<template>
  <!-- 企业 -->
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
          <ElButton type="primary">上传网格分配</ElButton>
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
        <template #locationType="{ row }">
          <div>{{ getLocationText(row.locationType) }}</div>
        </template>
        <template #hasPropertyAccount="{ row }">
          <div>{{ row.hasPropertyAccount ? '是' : '否' }}</div>
        </template>
        <template #implementFillStatus="{ row }">
          <div class="flex items-center justify-center">
            <span
              :class="['status', row.implementFillStatus === '1' ? 'status-suc' : 'status-err']"
            ></span>
            <span :class="[row.implementFillStatus === '0' ? 'red' : '']">
              {{ row.implementFillStatus === '0' ? '未填报' : '已填报' }}
            </span>
            <span :class="['ml-5', row.implementEscalationStatus === '0' ? 'red' : '']">
              {{ row.implementEscalationStatus === '0' ? '未上传报告' : '已上传报告' }}
            </span>
          </div>
        </template>
        <template #reportDate="{ row }">
          <div>{{ formatDate(row.reportDate) }}</div>
        </template>
        <template #filling="{ row }">
          <div class="filling-btn" @click="adjust(row)">调整网络</div>
        </template>
      </Table>
    </div>
    <el-dialog title="分配员" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px"> 请将已选择的企业，重新分配网格员 </div>
      <ElFormItem label="所属网格员" prop="reason">{{
        tableObject.currentRow?.gridmanName
      }}</ElFormItem>
      <ElFormItem label="调整网格员" prop="reason">
        <!-- <ElSelect clearable filterable v-model="reason" class="!w-full">
          <ElOption
            v-for="item in dictObj[367]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect> -->
      </ElFormItem>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>
    <Export
      :show="exportDialog"
      :type="'PeasantHousehold'"
      :list="exportList"
      @close="onExportDialogClose"
    />
    <GirdList :show="girdDialog" @close="onFormPupClose" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElMessage, ElDialog, ElFormItem, ElButton, ElSpace } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { getGridExportApi } from '@/api/workshop/export/service'
import { getLandlordListApi, getLandlordHeadApi } from '@/api/AssetEvaluation/service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import type { LandlordHeadInfoType } from '@/api/workshop/landlord/types'
import { updateLandlordApi } from '@/api/AssetEvaluation/gird-service'
import { locationTypes, SurveyStatusEnum } from '@/views/Workshop/components/config'
import { filterViewDoorNo, formatDate } from '@/utils/index'
import Export from '../../components/Export.vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import GirdList from './Girdlist.vue'
interface exportListType {
  name: string
  value: string | number
}
const exportList = ref<exportListType[]>([
  {
    name: '居民户统计表',
    value: 'exportPeasantHousehold'
  },
  {
    name: '人口调查统计表',
    value: 'exportDemographic'
  },
  {
    name: '房屋调查统计表',
    value: 'exportHouse'
  },
  {
    name: '附属物调查统计表',
    value: 'exportAppendage'
  },
  {
    name: '零星林果木调查统计表',
    value: 'exportTree'
  },
  {
    name: '家庭收入统计表',
    value: 'exportImmigrantIncome'
  }
])
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const dialogVisible = ref(false)
const exportDialog = ref(false)
const girdDialog = ref(false)
const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})
const { setSearchParams } = methods

tableObject.params = {
  projectId,
  status: 'implementation'
}

// setSearchParams({ type: 'PeasantHousehold', status: SurveyStatusEnum.Implementation })
setSearchParams({ type: 'Company', status: 'implementation' })
const girdList = () => {
  girdDialog.value = true
}
const setAllocationStatus = (targ) => {
  setSearchParams({
    type: 'Company',
    status: SurveyStatusEnum.Implementation,
    allocationStatus: targ == 1 ? 1 : targ == 0 ? null : targ == 2 ? 0 : null
  })
}
defineExpose({ setAllocationStatus })
// const onExport = () => {
//   exportDialog.value = true
// }
const onExportDialogClose = () => {
  exportDialog.value = false
}
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

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi({
    type: 'PeasantHousehold',
    status: SurveyStatusEnum.Implementation
  })
  headInfo.value = info
}

onMounted(() => {
  getVillageTree()
  getdistrictTree()
  getLandlordHeadInfo()
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
    label: '企业名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称'
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
    label: '企业名称',
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
    field: 'regionText',
    label: '分类',
    search: {
      show: false
    }
  },
  {
    field: 'legalPersonName',
    label: '法人姓名',
    width: 190,
    search: {
      show: false
    }
  },
  {
    field: 'regionText',
    label: '所属区域',
    search: {
      show: false
    }
  },
  {
    field: 'locationTypeText',
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
    },
    showOverflowTooltip: false
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

const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
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
      params.type = 'Company'
      params.status = SurveyStatusEnum.Implementation
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'Company'
    params.status = SurveyStatusEnum.Implementation
    setSearchParams({ ...params })
  }
}

// 数据填报
// const fillData = (row) => {
//   push({
//     name: 'AssetEvaDataFill',
//     query: {
//       projectId,
//       name: row.name,
//       householdId: row.id,
//       doorNo: row.doorNo,
//       type: 'Landlord'
//     }
//   })
// }
const adjust = (row) => {
  console.log('11111111')
  dialogVisible.value = true
  tableObject.currentRow = row
}
const onClose = () => {
  // reason.value = ''
  dialogVisible.value = false
}
const onSubmit = () => {
  // if (!reason.value) {
  //   ElMessage.warning('请选择删除原因')
  //   return
  // }
  const params: any = {
    householdId: tableObject.currentRow?.id,
    gridmanId: 138
  }
  updateLandlordApi(params).then(() => {
    ElMessage.success('操作成功')
    setSearchParams({ type: 'PeasantHousehold', status: SurveyStatusEnum.Implementation })
  })
  dialogVisible.value = false
}
const onFormPupClose = () => {
  girdDialog.value = false
}
const onDownLoad = async () => {
  const res = await getGridExportApi({
    type: 'Company',
    status: SurveyStatusEnum.Implementation
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
