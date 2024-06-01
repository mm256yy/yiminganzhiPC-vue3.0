<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">概算调整</ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>

    <div class="table-wrap">
      <div class="row">
        <div class="col left">
          <div class="data-box">
            合计金额： <span class="green">{{ sum.other?.finishAmount }}</span> 元
          </div>
        </div>
        <div class="col right">
          <ElButton type="primary" @click="onAdjust('1')"> 调整概算 </ElButton>
        </div>
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
        <template #createdDate="{ row }">
          <div>{{ formatDateTime(row.createdDate) }}</div>
        </template>
        <template #paymentType="{ row }">
          <div>{{ row.paymentType == 1 ? '专业项目' : '其他' }}</div>
        </template>
        <template #funSubjectId="{ row }">
          <div>{{ getTreeName(fundAccountList, row.funSubjectId) }}</div>
        </template>
        <template #action="{ row }">
          <ElButton type="primary" @click="onViewRow(row)" v-if="row.gsStatus == '2'">
            查看
          </ElButton>
          <ElButton type="primary" @click="onAdjust(row)" v-else> 调整 </ElButton>
        </template>
      </Table>
    </div>

    <!-- 查看 -->
    <ViewForm
      :show="dialog"
      :row="tableObject.currentRow"
      @close="onCloseView"
      :parmasList="parmasList"
    />

    <!-- 概算调整 -->
    <AdjustForm
      :show="adjustDialog"
      :selectionIds="selectionIds"
      @close="onCloseAdjust"
      :landlordIds="landlordIds"
      :statusType="statusType"
      :fundAccountList="fundAccountList"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted, toRaw } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElMessage } from 'element-plus'
import { Search } from '@/components/Search'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getBudgetAdjustmentListApi } from '@/api/fundManage/budgetAdjustment-service'
// import { getPaymentReviewListApi } from '@/api/fundManage/paymentApplication-service'
import { formatDateTime } from '@/utils/index'

import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import ViewForm from './ViewForm.vue'
import AdjustForm from './AdjustForm.vue'
import { PaymentApplicationByIdDetailApi } from '@/api/fundManage/paymentApplication-service'
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const projectId = appStore.currentProjectId
const dictObj = computed(() => dictStore.getDictObj)
const dialog = ref(false) // 查看弹窗标识
const adjustDialog = ref(false) // 调整概算弹窗标识
const fundAccountList = ref<any[]>([]) // 资金科目
const selectionIds = ref<any[]>([]) // 选择的项 id 集合
const landlordIds = ref<number[]>([])
const statusType = ref<any>()
const parmasList = ref<any[]>([])
const { register, tableObject, methods } = useTable({
  getListApi: getBudgetAdjustmentListApi
})

const { setSearchParams, getSelections } = methods

tableObject.params = {
  projectId,
  status: 4
}
setSearchParams({ status: 4 })

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
    }
  },
  {
    field: 'applyUserName',
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

  // table 字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
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
    field: 'name',
    label: '资金名称',
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
    field: 'paymentType',
    label: '付款对象类型',
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
    field: 'typeTxt',
    label: '概算科目',
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
    field: 'funSubjectId',
    label: '资金科目',
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
    field: 'amount',
    label: '资金金额(元)',
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
    field: 'applyTypeTxt',
    label: '申请类别',
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
    field: 'createdDate',
    label: '申请时间',
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
    field: 'applyUserName',
    label: '申请人',
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
    field: 'gsStatusTxt',
    label: '状态',
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
    width: 100,
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

tableObject.params = {
  projectId
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
  setSearchParams({ ...params, status: '4' })
}

const onReset = () => {
  tableObject.params = {
    projectId,
    status: '4'
  }
  setSearchParams({ status: '4' })
}

// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
    }
  })
}

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
const onViewRow = async (row: any) => {
  console.log('===============row=========', row)
  PaymentApplicationByIdDetailApi(row.id, 2).then((res: any) => {
    parmasList.value = res
    console.log(res, '测试')
    tableObject.currentRow = row
    dialog.value = true
  })
}

// 调整概算
const onAdjust = async (e) => {
  if (e == '1') {
    const res = await getSelections()
    if (res && res.length) {
      adjustDialog.value = true
      landlordIds.value = res.map((item) => item.id)
      statusType.value = res.map((item) => item.gsStatus)
      console.log('landlordIds', toRaw(statusType.value), toRaw(landlordIds.value))
    } else {
      ElMessage.info('请先勾选列表数据')
    }
  } else {
    adjustDialog.value = true
    landlordIds.value = [e.id]
    statusType.value = [e.gsStatus]
  }
}
// 关闭查看弹窗
const onCloseView = () => {
  dialog.value = false
}

// 关闭概算调整弹窗
const onCloseAdjust = (flag: boolean) => {
  adjustDialog.value = false
  if (flag === true) {
    setSearchParams({ status: '4' })
  }
}
let sum: any = ref(0)
onMounted(async () => {
  getFundSubjectList()
  sum.value = await getBudgetAdjustmentListApi(tableObject.params)
})
</script>

<style lang="less" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .col {
    display: flex;
    align-items: center;

    &.left {
      width: 700px;
      height: 32px;
      background: linear-gradient(90deg, rgba(106, 191, 255, 0.19) 0%, rgba(67, 174, 255, 0) 100%);

      .data-box {
        margin-left: 10px;
        font-size: 14px;
        color: #171718;

        .green {
          font-family: Helvetica-Bold, Helvetica;
          font-size: 20px;
          font-weight: bold;
          color: #30a952;
        }
      }
    }
  }
}
</style>
