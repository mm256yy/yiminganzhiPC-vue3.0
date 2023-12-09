<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金支付</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">资金支付记录</span>
          <div class="text">
            合计金额： <span class="num">{{ headInfo }}</span> 元
          </div>
        </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow"> 资金登记 </ElButton>
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
        <template #createTime="{ row }">
          <div>{{
            row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD  HH:mm:ss') : '-'
          }}</div>
        </template>

        <template #paymentTime="{ row }">
          <div>{{ row.paymentTime ? dayjs(row.paymentTime).format('YYYY-MM-DD') : '-' }}</div>
        </template>

        <template #status="{ row }">
          <div>{{ row.status === 0 ? '草稿' : '正常' }}</div>
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
            :edit="row.status === 0"
            :delete="row.status === 0"
            :row="row"
            :edit="row.status === 0"
            :delete="row.status === 0"
            @delete="onDelRow"
            @edit="onEditRow"
          />
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :fundAccountList="fundAccountList"
      @close="onEditFormClose"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElSpace, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import dayjs from 'dayjs'
import EditForm from './EditForm.vue'
import {
  getFunPayListApi,
  deleteFunPayApi,
  getLpListApi,
  getFunPaySumAmountApi
} from '@/api/fundManage/fundPayment-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const projectId = appStore.currentProjectId
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const headInfo = ref<any>()

const lpList = ref<any[]>([])
const actionType = ref<'view' | 'add' | 'edit'>('add')
const dialog = ref<boolean>(false)
const fundAccountList = ref<any[]>([]) // 资金科目

const { register, tableObject, methods } = useTable({
  getListApi: getFunPayListApi,
  delListApi: deleteFunPayApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getHeadInfo = async () => {
  const info = await getFunPaySumAmountApi()
  headInfo.value = info
}

const getLpListHandle = async () => {
  const res: any = await getLpListApi()
  if (res && res.length) {
    lpList.value = res.map((item) => {
      return {
        label: item.userName,
        value: item.id
      }
    })
  }
}

// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
      console.log(fundAccountList, '资金测试')
    }
  })
}

onMounted(() => {
  getHeadInfo()
  getLpListHandle()
  getFundSubjectList()
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

const onViewRow = (row) => {
  push(`/FundManage/FundPayment/Detail?id=${row.id}`)
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '资金支付名称',
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
    field: 'amount',
    label: '付款金额',
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
    field: 'applyType',
    label: '申请类型',
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
    field: 'createUserId',
    label: '登记人',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: lpList as any
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
    field: 'receivePaymentUnit',
    label: '收款单位',
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

  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    width: 160,
    field: 'name',
    label: '资金支付名称',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'typeText',
    label: '概算科目',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'funSubjectIdText',
    label: '资金科目',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'amount',
    label: '资金金额（元)',
    search: {
      show: false
    }
  },
  {
    field: 'applyTypeText',
    label: '资金类别',
    search: {
      show: false
    }
  },
  {
    field: 'receivePaymentUnit',
    label: '收款单位',
    search: {
      show: false
    }
  },
  {
    field: 'paymentTime',
    label: '付款日期',
    search: {
      show: false
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    search: {
      show: false
    }
  },
  {
    field: 'createUserName',
    label: '操作人',
    search: {
      show: false
    }
  },
  {
    width: 100,
    field: 'status',
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

const onEditFormClose = (flag: boolean) => {
  if (flag) {
    getHeadInfo()
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
