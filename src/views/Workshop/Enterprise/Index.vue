<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">企业信息采集</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'doorNo'"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">企业列表</span>

          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            共 <span class="num">{{ headInfo.peasantHouseholdNum }}</span> 家企业
            <!-- <span class="distance"></span>
            <span class="num">{{ headInfo.demographicNum || 20 }}</span> 人 -->
            <span class="distance"></span>
            已上报<span class="num !text-[#30A952]">{{ headInfo.reportSucceedNum }}</span
            >家
            <span class="distance"></span>
            未上报<span class="num !text-[#FF3030]">{{ headInfo.unReportNum }}</span
            >家
          </div>
        </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增企业</ElButton>
          <ElButton :icon="printIcon" type="default" @click="onPrint">打印表格</ElButton>
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
        <template #status="{ row }">
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
          <TableEditColumn
            :view-type="'link'"
            :icons="[
              {
                icon: '',
                tooltip: '查看',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
            :row="row"
            @edit="onEditRow(row)"
            @delete="onDelRow"
          />
        </template>
      </Table>
    </div>

    <EditForm
      :districtTree="districtTree"
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      @close="onFormPupClose"
    />
    <!-- @update-district="onUpdateDistrict"
    -->
    <Print
      :show="printDialog"
      :landlordIds="landlordIds"
      @close="onPrintDialogClose"
      :outsideData="outsideData"
    />
    <Survey :show="surveyDialog" :data="surveyInfo" @close="onSurveyDialogClose" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
//
import {
  ElButton,
  ElSpace,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import Print from './components/Print.vue'
import Survey from './components/Survey.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { getDistrictTreeApi } from '@/api/district'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getLandlordListApi,
  delLandlordByIdApi,
  getLandlordHeadApi,
  getLandlordSurveyByIdApi
} from '@/api/workshop/landlord/service'
import { screeningTree } from '@/api/workshop/village/service'
// ReportStatusEnums
import { locationTypes } from '@/views/Workshop/components/config'
import { ReportStatus } from '@/views/Workshop/DataFill/config'
import { useRouter } from 'vue-router'
import type {
  LandlordDtoType,
  LandlordHeadInfoType,
  SurveyInfoType
} from '@/api/workshop/landlord/types'
import { formatDate } from '@/utils/index'

const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
// const villageTree = ref<any[]>([])
const landlordIds = ref<number[]>([])
const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})
const outsideData = ref<any>([])
const printDialog = ref(false)
const surveyDialog = ref(false)
const surveyInfo = ref<SurveyInfoType | null>(null)

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})

const { setSearchParams, getSelections } = methods

tableObject.params = {
  projectId
}

// getList()
setSearchParams({ type: 'Company' })
// const getVillageTree = async () => {
//   const list = await screeningTree(projectId, 'Company')
//   villageTree.value = list || []
//   return list || []
// }

// const onUpdateDistrict = () => {
//   getVillageTree()
// }
const districtTree = ref<any>([])
const getDistrictTree = async () => {
  const list = await screeningTree(projectId, 'Company')
  districtTree.value = list || []
  return list || []
}

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi({ type: 'Company' })
  headInfo.value = info
}

onMounted(() => {
  getDistrictTree()
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
    field: 'name',
    label: '企业名称',
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
    field: 'doorNo',
    label: '企业编码',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入编码'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'legalPersonName',
    label: '法人姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人姓名'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'legalPersonCard',
    label: '法人身份证号',
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
    field: 'doorNo',
    label: '企业编码',
    width: 100,
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
    field: 'status',
    label: '是否填报',
    search: {
      show: false
    }
  },
  {
    field: 'reportDate',
    label: '上报时间',
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
    width: 150,
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
  console.log(result.immigrantGraveList.length)
  ElMessageBox.confirm(
    `
    <div style='text-align:center'>
    <strong>${row.name}企业包含:</strong>
  <div>房屋信息: ${result.immigrantHouseList.length} 栋房屋信息</div>
  <div>附属物信息: ${result.immigrantAppendantList.length} 项附属物信息</div>
  <div>零星(林)果木信息: ${result.immigrantTreeList.length} 项零星果木信息</div>

  <strong>是否删除该企业信息</strong>
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
        setSearchParams({ type: 'Company' })
      })
    })
    .catch(() => {})

  // const { delList, getSelections } = methods
  // const selections = await getSelections()
  // await delList(
  //   multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
  //   multiple
  // )
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = (row: LandlordDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    // getList()
    setSearchParams({ type: 'Company' })
  }
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
    ...data,
    type: 'Company'
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
  if (!params.status) {
    delete params.status
  }
  if (!params.card) {
    delete params.card
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }

      params.type = 'Company'
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'Company'

    setSearchParams({ ...params })
  }
}

const onPrint = async () => {
  const res = await getSelections()
  if (res && res.length) {
    landlordIds.value = res.map((item) => item.id)
    printDialog.value = true
    outsideData.value = res.map((item) => item.name)
  } else {
    ElMessage.warning('请选择需要打印的企业')
  }
}

const onPrintDialogClose = () => {
  printDialog.value = false
}

// 数据填报
const fillData = (row) => {
  push({
    name: 'DataFill',
    query: {
      householdId: row.id,
      doorNo: row.doorNo,
      type: 'Enterprise'
    }
  })
}

const onSurveyDialogClose = () => {
  surveyDialog.value = false
}

const onViewRow = async (row) => {
  // const result = await getLandlordSurveyByIdApi(row.id)
  // if (result) {
  //   surveyInfo.value = result
  //   surveyDialog.value = true
  // } else {
  //   ElMessage.warning('查看失败！')
  // }
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
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
