<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">居民户信息{{ titleStatus }}</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" expand @search="onSearch" @reset="onReset" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">居民户列表</span>

          <div class="text">
            （共 <span class="num">{{ headInfo.peasantHouseholdNum }}</span> 户
            <span class="distance"></span>
            <span class="num">{{ headInfo.demographicNum }}</span> 人
            <span class="distance"></span>
            已填报<span class="num !text-[#30A952]">{{ headInfo.reportSucceedNum }}</span>
            <span class="distance"></span>
            未填报<span class="num !text-[#FF3030]">{{ headInfo.unReportNum }}</span
            >）
          </div>
        </div>
        <ElSpace>
          <ElButton :icon="deleteIcon" type="primary" @click="onBatchDelete">批量删除</ElButton>
          <ElButton type="primary" @click="onExport">数据导出</ElButton>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加居民户</ElButton>
          <ElButton :icon="printIcon" type="default" @click="onPrint">打印表格</ElButton>
        </ElSpace>
      </div>
      <Table
        ref="tableRef"
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
        selection
        highlightCurrentRow
        @register="register"
      >
        <template #showDoorNo="{ row }">
          {{ filterViewDoorNos(row) }}
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
        <template #signUser="{ row }">
          <div>{{ row.signUser ? '是' : '否' }}</div>
        </template>
        <template #reportStatus="{ row }">
          <div class="flex items-center justify-center">
            <span
              :class="[
                'status',
                row.reportStatus === ReportStatus.ReportSucceed ? 'status-suc' : 'status-err'
              ]"
            ></span>
            {{ row.reportStatus === ReportStatus.ReportSucceed ? '已填报' : '未填报' }}</div
          >
        </template>
        <template #reportDate="{ row }">
          <div>{{ formatDate(row.reportDate) }}</div>
        </template>
        <template #filling="{ row }">
          <div class="filling-btn" @click="fillData(row)">数据填报</div>
        </template>
        <template #action="{ row }">
          <span
            @click="onViewRow(row)"
            :style="{ color: '#3e73ec', cursor: 'pointer', marginRight: '5px' }"
          >
            快速查看
          </span>
          <span
            @click="onEditRow(row)"
            :style="{ color: '#3e73ec', cursor: 'pointer', marginRight: '5px' }"
          >
            编辑
          </span>
          <span @click="onDelRow(row)" :style="{ color: 'red', cursor: 'pointer' }">删除</span>
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :districtTree="districtTree"
      ref="formRef"
      @close="onFormPupClose"
      @update-district="onUpdateDistrict"
    />

    <Print
      :show="printDialog"
      :templateType="PrintType.print"
      :landlordIds="landlordIds"
      :outsideData="outsideData"
      @close="onPrintDialogClose"
    />
    <Export
      :show="exportDialog"
      :type="'PeasantHousehold'"
      :list="exportList"
      @close="onExportDialogClose"
    />
    <Survey :show="surveyDialog" :data="surveyInfo" @close="onSurveyDialogClose" />
  </WorkContentWrap>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { globalData } from '@/config/fill'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

export default defineComponent({
  beforeRouteEnter(to, _from, next) {
    if (to.path === '/Workshop/Landlord') {
      // 实物采集
      globalData.currentSurveyStatus = SurveyStatusEnum.Survey
    } else {
      // 实物复核
      globalData.currentSurveyStatus = SurveyStatusEnum.Review
    }
    next()
  }
})
</script>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import {
  ElButton,
  ElMessage,
  ElSpace,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElMessageBox
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
// TableEditColumn
import { Table } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import Print from '../components/Print.vue'
import Export from '../components/Export.vue'
import Survey from './components/Survey.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getLandlordListApi,
  delLandlordByIdApi,
  getLandlordHeadApi,
  getLandlordSurveyByIdApi,
  batchDeleteApi,
  getPeasantHouseHoldInfo,
  batchDelete
} from '@/api/workshop/landlord/service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import { locationTypes, ReportStatusEnums } from '@/views/Workshop/components/config'
import { ReportStatus } from '@/views/Workshop/DataFill/config'
import { useRouter } from 'vue-router'
import type {
  LandlordDtoType,
  LandlordHeadInfoType,
  SurveyInfoType
} from '@/api/workshop/landlord/types'
import { filterViewDoorNos, formatDate } from '@/utils/index'
import { PrintType } from '@/types/print'
import { useDictStoreWithOut } from '@/store/modules/dict'
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const router = useRouter()
const titleStatus = router.currentRoute.value?.meta?.title?.split('-')[1]
  ? router.currentRoute.value?.meta?.title?.split('-')[1]
  : '采集'
const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
const deleteIcon = useIcon({ icon: 'ant-design:delete-outlined' })
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const tableRef = ref()

const landlordIds = ref<number[]>([])
const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})
const printDialog = ref(false)
const exportDialog = ref(false)
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
  },
  {
    name: '安置意愿表',
    value: 'exportImmigrantWill'
  }
])
const surveyDialog = ref(false)
const surveyInfo = ref<SurveyInfoType | null>(null)
const outsideData = ref<any>([])
const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})
const { setSearchParams, getSelections } = methods

tableObject.params = {
  projectId
}

setSearchParams({ type: 'PeasantHousehold' })

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

const onUpdateDistrict = () => {
  getVillageTree()
  getdistrictTree()
}

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi({ type: 'PeasantHousehold' })
  headInfo.value = info
}

const onReset = () => {
  tableObject.params = {
    projectId
  }
  setSearchParams({ type: 'PeasantHousehold' })
}

onMounted(() => {
  getVillageTree()
  getdistrictTree()
  getLandlordHeadInfo()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '所属区域',
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
    field: 'blurry',
    label: '关键字',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '户主或人口/户号/联系方式'
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
    field: 'signStatus',
    label: '是否签字',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            label: '是',
            value: 'Sign'
          },
          {
            label: '否',
            value: 'UnSign'
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'reportStatus',
    label: '填报状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: ReportStatusEnums
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'hasPropertyAccount',
    label: '财产户',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '是',
            value: 'true'
          },
          {
            label: '否',
            value: 'false'
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'locationType',
    label: '所在位置',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[326]
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
    label: '户主姓名',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '户号',
    width: 180,
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
    field: 'reportStatus',
    label: '填报状态',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'hasPropertyAccount',
    label: '财产户',
    search: {
      show: false
    }
  },
  {
    field: 'locationTypeText',
    label: '所属位置',
    search: {
      show: false
    }
  },
  {
    field: 'reportUserName',
    label: '填报人',
    search: {
      show: false
    }
  },
  {
    field: 'reportDate',
    label: '填报时间',
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'signUser',
    label: '是否签字',
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'filling',
    label: '填报',
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
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 200,
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

const onDelRow = async (row: LandlordDtoType) => {
  tableObject.currentRow = row
  const result = await getLandlordSurveyByIdApi(row?.id)
  ElMessageBox.confirm(
    `
    <div style='text-align:center'>
      <strong>${row.name}居民户包含:</strong>
      <div>人口信息: ${result.demographicList.length} 口人信息</div>
      <div>房屋信息: ${result.immigrantHouseList.length} 栋房屋信息</div>
      <div>附属物信息: ${result.immigrantAppendantList.length} 项附属物信息</div>
      <div>零星(林)果木信息: ${result.immigrantTreeList.length} 项零星果木信息</div>
      <div>坟墓信息: ${result.immigrantGraveList.length} 条坟墓信息</div>
      <strong>是否删除该居户信息</strong>
    </div>
  `,
    '提示',
    {
      dangerouslyUseHTMLString: true,

      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }
  )
    .then(() => {
      delLandlordByIdApi(tableObject.currentRow?.id as number).then(() => {
        // getList()
        setSearchParams({ type: 'PeasantHousehold' })
      })
    })
    .catch(() => {})
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}
const formRef = ref<any>(null)
const onEditRow = (row: LandlordDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  formRef.value?.initData(row)
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    setSearchParams({ type: 'PeasantHousehold' })
  }
  getLandlordHeadInfo()
}

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
    Village: 'villageCodes', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
}

const onSearch = (data) => {
  console.log()
  // 处理参数
  let params = {
    ...data
  }
  if (!data.reportStatus) {
    Reflect.deleteProperty(params, 'reportStatus')
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
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }

      params.type = 'PeasantHousehold'
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'PeasantHousehold'

    setSearchParams({ ...params })
  }
}

const onPrint = async () => {
  const res = await getSelections()
  if (res && res.length) {
    outsideData.value = res.map((item) => item.name)

    landlordIds.value = res.map((item) => item.id)
    printDialog.value = true
  } else {
    ElMessage.warning('请选择需要打印的居民户')
  }
}

const onPrintDialogClose = () => {
  printDialog.value = false
}

// 批量删除
const onBatchDelete = async () => {
  if (tableRef.value.selections?.length <= 0) {
    ElMessage.error('请至少选中一条记录')
    return
  }
  ElMessage.error('建设中')
  // const doorNoList = tableRef.value.selections.map((item) => item.doorNo)
  // const idList = tableRef.value.selections.map((item) => item.id)
  // let m = await getPeasantHouseHoldInfo({
  //   status: globalData.currentSurveyStatus,
  //   doorNoList: doorNoList
  // })
  // ElMessageBox.confirm(
  //   `
  //   <div style='text-align:center'>
  //     <strong>选择${m.householdNum}居民户包含:</strong>
  //     <div>人口信息: ${m.demographicNum} 人口信息</div>
  //     <div>房屋信息: ${m.houseNum} 栋房屋信息</div>
  //     <div>附属物信息: ${m.appendantNum} 项附属物信息</div>
  //     <div>零星(林)果木信息: ${m.treeNum} 项零星果木信息</div>
  //     <div>坟墓信息: ${m.graveNum} 条坟墓信息</div>
  //     <strong>是否删除该居户信息</strong>
  //   </div>
  // `,
  //   '提示',
  //   {
  //     dangerouslyUseHTMLString: true,

  //     cancelButtonText: '取消',
  //     confirmButtonText: '确认'
  //   }
  // )
  //   .then(() => {
  //     batchDelete(idList).then(() => {
  //       // getList()
  //       ElMessage.success('批量删除成功')
  //       setSearchParams({ type: 'PeasantHousehold' })
  //     })
  //   })
  //   .catch(() => {})
}

const onExport = () => {
  if (headInfo.value.unReportNum > 0) {
    ElMessageBox.alert(
      `数据报表中，存在${headInfo.value.unReportNum}户“未填报”的居民户，可在居民户列表核定并删除`,
      '导出提示',
      {
        confirmButtonText: '确认',
        callback: () => {
          exportDialog.value = true
        }
      }
    )
  } else {
    exportDialog.value = true
  }
}

const onExportDialogClose = () => {
  exportDialog.value = false
}

// 数据填报
const fillData = (row) => {
  let routerName = 'DataFill'
  if (globalData.currentSurveyStatus === SurveyStatusEnum.Review) {
    routerName = 'DataFillCheck'
  }
  push({
    name: routerName,
    query: {
      name: row.name,
      householdId: row.id,
      doorNo: row.doorNo,
      type: 'Landlord',
      showDoorNo: row.showDoorNo
    }
  })
}

const onSurveyDialogClose = () => {
  surveyDialog.value = false
}

const onViewRow = async (row) => {
  const result = await getLandlordSurveyByIdApi(row.id)
  if (result) {
    surveyInfo.value = result
    surveyDialog.value = true
  } else {
    ElMessage.warning('查看失败！')
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
