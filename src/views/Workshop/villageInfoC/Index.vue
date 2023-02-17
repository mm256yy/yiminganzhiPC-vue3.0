<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">村集体信息采集</ElBreadcrumbItem>
    </ElBreadcrumb>
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
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">村集体列表</span>

          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            共 <span class="num">{{ headInfo.peasantHouseholdNum || 10 }}</span> 家村集体
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
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增村集体</ElButton>
          <!-- <ElButton :icon="printIcon" type="default" @click="onPrint">打印表格</ElButton> -->
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
        <template #locationType="{ row }">
          <div>{{ getLocationText(row.locationType) }}</div>
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
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :districtTree="villageTree"
      @close="onFormPupClose"
      @update-district="onUpdateDistrict"
    />

    <Print :show="printDialog" :landlordIds="landlordIds" @close="onPrintDialogClose" />
    <Survey :show="surveyDialog" :data="surveyInfo" @close="onSurveyDialogClose" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
// ElMessage,
import { ElButton, ElSpace, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import Print from './components/Print.vue'
import Survey from './components/Survey.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
// getLandlordSurveyByIdApi
import {
  getLandlordListApi,
  delLandlordByIdApi,
  getLandlordHeadApi
} from '@/api/workshop/landlord/service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
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
// const printIcon = useIcon({ icon: 'ion:print-outline' })
const villageTree = ref<any[]>([])
const landlordIds = ref<number[]>([])
const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})
const printDialog = ref(false)
const surveyDialog = ref(false)
const surveyInfo = ref<SurveyInfoType | null>(null)

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})
// getSelections
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getVillageTree = async () => {
  const list = await getVillageTreeApi(projectId)
  villageTree.value = list || []
  return list || []
}

const onUpdateDistrict = () => {
  getVillageTree()
}

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi()
  headInfo.value = info
}

onMounted(() => {
  getVillageTree()
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
    field: 'blurry',
    label: '村集体名称',
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
    field: 'blurry',
    label: '村集体编码',
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
    field: 'card',
    label: '联系方式',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式'
      }
    },
    table: {
      show: false
    }
  },

  // {
  //   field: 'blurry',
  //   label: '关键字',
  //   search: {
  //     show: true,
  //     component: 'Input',
  //     componentProps: {
  //       placeholder: '户主/户号/联系方式'
  //     }
  //   },
  //   table: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'card',
  //   label: '身份证号',
  //   search: {
  //     show: true,
  //     component: 'Input',
  //     componentProps: {
  //       placeholder: '请输入身份证号'
  //     }
  //   },
  //   table: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'reportStatus',
  //   label: '上报状态',
  //   search: {
  //     show: true,
  //     component: 'Select',
  //     componentProps: {
  //       options: ReportStatusEnums
  //     }
  //   },
  //   table: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'hasPropertyAccount',
  //   label: '财产户',
  //   search: {
  //     show: true,
  //     component: 'Select',
  //     componentProps: {
  //       options: [
  //         {
  //           label: '是',
  //           value: 'true'
  //         },
  //         {
  //           label: '否',
  //           value: 'false'
  //         }
  //       ]
  //     }
  //   },
  //   table: {
  //     show: false
  //   }
  // },

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
    label: '村集体名称',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '联系方式',
    width: 100,
    search: {
      show: false
    }
  },

  {
    field: 'status',
    label: '所属区域',
    width: 180,
    search: {
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
        options: locationTypes
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'hasPropertyAccount',
    label: '填报人',
    search: {
      show: false
    }
  },
  {
    field: 'status',
    label: '是否上报',
    search: {
      show: false
    }
  },
  {
    field: 'reportDate',
    label: '上报时间',
    search: {
      show: false
    }
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

const onDelRow = async (row: LandlordDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
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
    getList()
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
  if (!params.status) {
    delete params.status
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      delete params.code
      setSearchParams({ ...params })
    })
  } else {
    delete params.code
    setSearchParams({ ...params })
  }
}

// const onPrint = async () => {
//   const res = await getSelections()
//   if (res && res.length) {
//     landlordIds.value = res.map((item) => item.id)
//     printDialog.value = true
//   } else {
//     ElMessage.warning('请选择需要打印的村集体')
//   }
// }

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
      type: 'villageInfoC'
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
