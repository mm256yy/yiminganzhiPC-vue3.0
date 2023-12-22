<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金审核</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <el-radio-group class="mb-5" v-model="tabVal" @change="tabChange">
        <el-radio-button label="1">待办</el-radio-button>
        <el-radio-button label="2">已办</el-radio-button>
      </el-radio-group>
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">付款申请记录</span>
        </div>
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
        highlightCurrentRow
        @register="register"
      >
        <template #createdDate="{ row }">
          <div>{{ formatDateTime(row.createdDate) }}</div>
        </template>

        <template #type="{ row }">
          <div>{{ row.type == 1 ? '概算内' : '概算外' }}</div>
        </template>
        <template #paymentType="{ row }">
          <div>{{ row.paymentType == 1 ? '专业项目' : '其他' }}</div>
        </template>
        <template #funSubjectId="{ row }">
          <div>{{ getTreeName(fundAccountList, row.funSubjectId) }}</div>
        </template>
        <!-- <template #action="{ row }">
            <TableEditColumn :view-type="'link'" :row="row" @delete="onDelRow" @edit="onEditRow" />
          </template> -->
        <template #action="{ row }">
          <el-button type="primary" link @click="onViewRow(row)">查看</el-button>
          <el-button type="primary" link @click="onReviewRow(row)" v-if="tabVal == 1"
            >审核</el-button
          >
          <!-- <el-button v-if="row.relation != 1" type="danger" link @click="onDelRow(row)">
            删除    
          </el-button> -->
        </template>
      </Table>
    </div>

    <!-- <EditForm :show="dialog" @close="onEditFormClose" /> -->
    <ReviewForm
      :show="dialog"
      @close="onCloseReview"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :parmasList="parmasList"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElRadioGroup, ElRadioButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import ReviewForm from './ReviewForm.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import {
  getPaymentReviewListApi,
  PaymentApplicationByIdDetailApi
} from '@/api/fundManage/paymentApplication-service'
import { getDemographicHeadApi, getExcelList } from '@/api/workshop/population/service'
import type { DemographicHeadType, ExcelListType } from '@/api/workshop/population/types'
import { formatDateTime } from '@/utils/index'
let tableRef = ref()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const tabVal = ref<any>(1)

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])
const parmasList = ref<any[]>([])

const headInfo = ref<DemographicHeadType>({
  demographicNum: 0,
  peasantHouseholdNum: 0
})

const excelList = ref<ExcelListType[]>([])
const actionType = ref<'view' | 'add' | 'edit'>('view')
const dialog = ref<boolean>(false)

let timer = 0

const { register, tableObject, methods } = useTable({
  getListApi: getPaymentReviewListApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId,
  businessId: 1,
  auditType: tabVal.value
}

getList()
const tabChange = (data: string) => {
  tabVal.value = data
  setSearchParams({ businessId: 1, auditType: tabVal.value })
  let tablecloume = useCrudSchemas(schema).allSchemas.tableColumns
  console.log(tablecloume)

  if (tabVal.value == '1') {
    allSchemas.tableColumns = tablecloume
  } else {
    allSchemas.tableColumns = tablecloume.reduce((pre: any, item) => {
      if (item.field == 'applyUserName') {
        pre.push(item)
        pre.push({
          field: 'statusText',
          label: '状态',
          search: {
            show: false
          }
        })
      } else {
        pre.push(item)
      }
      return pre
    }, [])
  }
}
const getDemographicHeadInfo = async () => {
  const info = await getDemographicHeadApi()
  headInfo.value = info
}

const getExcelUploadList = async () => {
  const res = await getExcelList()
  if (res && res.content) {
    excelList.value = res.content
  }
}
const fundAccountList = ref<any[]>([]) // 资金科目

// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
    }
  })
}

// 获取树形递归数据
const getTreeName = (list: any, code: any) => {
  for (let i = 0; i < list.length; i++) {
    let a = list[i]
    if (a.code == code) {
      return a.name
    } else {
      if (a.children && a.children.length > 0) {
        let res = getTreeName(a.children, code)
        if (res) {
          return res
        }
      }
    }
  }
}
onMounted(() => {
  getDemographicHeadInfo()
  getExcelUploadList()
  getFundSubjectList()
})

onBeforeUnmount(() => {
  clearInterval(timer)
  timer = 0
})

const onReviewRow = async (row) => {
  let res: any = await PaymentApplicationByIdDetailApi(row.id, 1)
  parmasList.value = res
  console.log(res, '测试')

  actionType.value = 'edit'
  tableObject.currentRow = {
    ...row
    // parmasList: parmasList.value
  }
  tableObject.currentRow = row
  dialog.value = true
}
const onViewRow = async (row: any) => {
  let res: any = await PaymentApplicationByIdDetailApi(row.id, 1)
  parmasList.value = res
  console.log(res, '测试')

  actionType.value = 'view'
  tableObject.currentRow = {
    ...row
    // parmasList: parmasList.value
  }
  tableObject.currentRow = row
  dialog.value = true
}

// 关闭审核弹窗
const onCloseReview = () => {
  dialog.value = false
  getList()
}
const schema = reactive<CrudSchema[]>([
  {
    field: 'applyType',
    label: '申请类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[381]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'name',
    label: '申请名称',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'createdDate',
    label: '申请时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD'
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'amount',
    label: '申请金额',
    search: {
      show: true,
      component: 'InputRange'
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'type',
    label: '概算科目',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[382]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'funSubjectId',
    label: '资金科目',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: fundAccountList,
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
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'createdBy',
    label: '申请人',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'paymentType',
    label: '付款对象类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[384]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    width: 160,
    field: 'code',
    label: '付款编号',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'name',
    label: '申请名称',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'paymentType',
    label: '付款对象类型',
    search: {
      show: false
    }
  },
  {
    width: 200,
    field: 'type',
    label: '概算科目',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'funSubjectId',
    label: '资金科目',
    search: {
      show: false
    }
  },
  {
    field: 'amount',
    label: '资金金额（元）',
    search: {
      show: false
    }
  },
  {
    field: 'applyTypeTxt',
    label: '申请类别',
    search: {
      show: false
    }
  },
  {
    field: 'createdDate',
    label: '创建时间',
    search: {
      show: false
    }
  },
  {
    field: 'createdBy',
    label: '申请人',
    search: {
      show: false
    }
  },

  // {
  //   width: 100,
  //   field: 'statusText',
  //   label: '状态',
  //   search: {
  //     show: false
  //   }
  // },
  {
    width: 200,
    field: 'action',
    label: '操作',
    fixed: 'right',
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

let { allSchemas } = useCrudSchemas(schema)

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
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData)

  if (searchData.relation == '1') {
    searchData.relation = ['is', 1]
  } else if (searchData.relation == '0') {
    searchData.relation = ['not', 1]
  } else {
    delete searchData.relation
  }

  // 处理参数
  let params = {
    ...searchData
  }
  tableObject.params = {
    projectId,
    auditType: 1,
    businessId: 1
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
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}
</style>
