<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金预拨</ElBreadcrumbItem>
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
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">资金预拨记录</span>

          <div class="text">
            合计金额： <span class="num">{{ sumAmount }}</span> 元
          </div>
        </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow"> 预拨 </ElButton>
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
        <template #recordTime="{ row }">
          <div>{{ row.recordTime ? dayjs(row.recordTime).format('YYYY-MM-DD') : '-' }}</div>
        </template>

        <template #createdDate="{ row }">
          <div>{{
            row.createdDate ? dayjs(row.createdDate).format('YYYY-MM-DD HH:mm:ss') : '-'
          }}</div>
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
            :row="row"
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
  getFundEntryListApi,
  deleteFundEntryApi,
  getSumAmountApi
} from '@/api/fundManage/fundEntry-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const projectId = appStore.currentProjectId
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
// const importIcon = useIcon({ icon: 'ant-design:import-outlined' })

const actionType = ref<'view' | 'add' | 'edit'>('add')
const dialog = ref<boolean>(false)
const sumAmount = ref<string>('')

const { register, tableObject, methods } = useTable({
  getListApi: getFundEntryListApi,
  delListApi: deleteFundEntryApi
})

const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}
// 获取列表
getList()

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
  push(`/FundManage/FundEntry/Detail?id=${row.id}`)
}

// const onExport = () => {
//   console.log('导出')
//   // 无接口
// }

const sumAmountApi = async () => {
  try {
    sumAmount.value = await getSumAmountApi()
  } catch (error) {}
}

onMounted(() => {
  sumAmountApi()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '资金名称',
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
    field: 'source',
    label: '资金来源',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[388]
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
    label: '金额(元)',
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
    field: 'recordTime',
    label: '付款时间',
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
    field: 'status',
    label: '状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '草稿',
            value: 0
          },
          {
            label: '正常',
            value: 1
          }
        ]
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
    field: 'name',
    label: '资金名称',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'sourceText',
    label: '资金来源',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'amount',
    label: '金额(元)',
    search: {
      show: false
    }
  },
  {
    width: 200,
    field: 'recordTime',
    label: '付款时间',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'createdDate',
    label: '创建时间',
    search: {
      show: false
    }
  },
  {
    field: 'createdBy',
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
    sumAmountApi()
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
