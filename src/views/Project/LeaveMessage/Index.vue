<template>
  <WorkContentWrap>
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
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">实景留言</span>
        </div>
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
          <el-button type="primary" link @click="onViewRow(row)">查看</el-button>
          <el-button type="primary" link @click="onEditRow(row)">审核</el-button>
          <el-button type="danger" link @click="onDelRow(row, false)"> 删除 </el-button>
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
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}

// const onExport = () => {
//   console.log('导出')
//   // 无接口
// }

const sumAmountApi = async () => {
  try {
    sumAmount.value = await getSumAmountApi({
      projectId,
      type: '1'
    })
  } catch (error) {}
}

onMounted(() => {
  sumAmountApi()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '留言内容',
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
    field: 'name',
    label: '留言提交人',
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
    label: '留言内容',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'sourceText',
    label: '被留言对象类型',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'amount',
    label: '被留言对象ID',
    search: {
      show: false
    }
  },
  {
    width: 200,
    field: 'recordTime',
    label: '留言提交人',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'createdDate',
    label: '留言人ID',
    search: {
      show: false
    }
  },
  {
    field: 'createdBy',
    label: '留言人所在村',
    search: {
      show: false
    }
  },

  {
    width: 100,
    field: 'status',
    label: '留言位置',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'createdDate',
    label: '提交时间',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'createdDate',
    label: '审核状态',
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
