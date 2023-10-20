<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">付款申请</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">付款申请记录</span>

          <div class="text">
            已完成：{{ otherList.finishNum }}笔
            <span class="num">{{ otherList.finishAmount }}</span> 元
          </div>
          <div class="text">
            审核中：{{ otherList.auditNum }}笔
            <span class="num">{{ otherList.auditAmount }}</span> 元
          </div>
          <div class="text">
            待提交：{{ otherList.draftNum }}笔
            <span class="num">{{ otherList.draftAmount }}</span> 元
          </div>
        </div>
        <ElSpace>
          <ElButton type="primary" @click="onAddRow"> 申请 </ElButton>
        </ElSpace>
      </div>
      <Table
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
          <div>{{ formatDate(row.createdDate) }}</div>
        </template>
        <template #paymentType="{ row }">
          <div>{{ row.paymentType == 1 ? '专业项目' : '其他' }}</div>
        </template>
        <template #age="{ row }">
          <div>{{ analyzeIDCard(row.card) }}</div>
        </template>
        <template #action="{ row }">
          <el-button type="primary" link @click="onViewRow(row)">查看</el-button>
          <el-button type="primary" link @click="onEditRow(row)">编辑</el-button>
          <el-button v-if="row.relation != 1" type="danger" link @click="onDelRow(row, false)">
            删除
          </el-button>
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      @close="onEditFormClose"
      :actionType="actionType"
      :row="tableObject.currentRow"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElSpace, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'

import {
  getPaymentApplicationListApi,
  delPaymentApplicationByIdApi,
  PaymentApplicationByIdDetailApi
} from '@/api/fundManage/paymentApplication-service'
import { formatDate, analyzeIDCard } from '@/utils/index'
import EditForm from './EditForm.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const fundAccountList = ref<any[]>([]) // 资金科目
const otherList = ref<any>({})
// const parmasList = ref<any[]>([])
// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
    }
  })
}

const otherListApi = () => {
  getPaymentApplicationListApi().then((res: any) => {
    if (res) {
      otherList.value = res.other
    }
  })
}
// const otherListApi = async () => {
//   const list = await getPaymentApplicationListApi()
//   otherList.value = list.other
// }
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)
// const excelList = ref<ExcelListType[]>([])
const actionType = ref<'view' | 'add' | 'edit'>('add')
const dialog = ref<boolean>(false)

const { register, tableObject, methods } = useTable({
  getListApi: getPaymentApplicationListApi,
  delListApi: delPaymentApplicationByIdApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

// const getDemographicHeadInfo = async () => {
//   const info = await getDemographicHeadApi()
//   headInfo.value = info
// }

// const getExcelUploadList = async () => {
//   const res = await getExcelList()
//   if (res && res.content) {
//     excelList.value = res.content
//   }
// }

onMounted(() => {
  getFundSubjectList()
  console.log(tableObject, '11111111')
  otherListApi()
})

const onDelRow = async (row: any, multiple: boolean) => {
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

const onEditRow = (row: any) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}
const onViewRow = (row: any) => {
  PaymentApplicationByIdDetailApi({ id: row.id, type: 1 }).then((res: any) => {
    // parmasList.value = res.content
    console.log(res)
  })
  actionType.value = 'view'
  tableObject.currentRow = {
    ...row
    // parmasList: parmasList.value
  }
  tableObject.currentRow = row
  dialog.value = true
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
    field: 'gsStatus',
    label: '状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[386]
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
      component: 'Input',
      componentProps: {
        placeholder: '请输入'
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
    field: 'createdDate',
    label: '申请时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
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
    }
  },
  {
    field: 'applyUser',
    label: '申请人',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入'
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
    field: 'typeTxt',
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
    field: 'createDate',
    label: '创建时间',
    search: {
      show: false
    }
  },
  {
    field: 'applyUserName',
    label: '申请人',
    search: {
      show: false
    }
  },

  {
    width: 100,
    field: 'gsStatusTxt',
    label: '状态',
    search: {
      show: false
    }
  },
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }

  if (!params.name) {
    delete params.name
  }

  if (!params.applyType) {
    delete params.applyType
  }

  if (!params.dataState) {
    delete params.dataState
  }

  if (!params.createdDate) {
    delete params.createdDate
  }

  if (!params.amount && !params.amount.length) {
    delete params.amount
  }

  if (!params.type) {
    delete params.type
  }

  if (!params.funSubjectId) {
    delete params.funSubjectId
  }

  if (!params.applyUserName) {
    delete params.applyUserName
  }

  if (!params.paymentType) {
    delete params.paymentType
  }

  // setSearchParams({ ...params, status: '4' })
  setSearchParams({ ...params })
}

const onEditFormClose = (flag: boolean) => {
  if (flag) {
    getList()
  }
  dialog.value = false
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
