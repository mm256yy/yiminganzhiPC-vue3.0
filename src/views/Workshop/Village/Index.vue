<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">基础设置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">自然村预登记</ElBreadcrumbItem>
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
        <div class="table-left-title"> 自然村列表 </div>
        <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
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
        :showOverflowTooltip="false"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #latitude="{ row }">
          <div>{{ row.longitude }}</div>
          <div>{{ row.latitude }}</div>
        </template>
        <template #action="{ row }">
          <TableEditColumn
            :row="row"
            :view-type="'link'"
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
      :districtTree="districtTree"
      @close="onFormPupClose"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getVillageListApi, delVillageByIdApi } from '@/api/workshop/village/service'
import { getDistrictTreeApi } from '@/api/district'
import type { VillageDtoType } from '@/api/workshop/village/types'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const districtTree = ref([])

const { register, tableObject, methods } = useTable({
  getListApi: getVillageListApi,
  delListApi: delVillageByIdApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getDistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

onMounted(() => {
  getDistrictTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: 'ID',
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
    field: 'districtName',
    label: '所属区域',
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
    label: '自然村',
    search: {
      show: true,
      component: 'Input'
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'code',
    label: '编码',
    search: {
      show: true,
      component: 'Input'
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'parentCode',
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
        }
      }
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    table: {
      show: false
    }
  },
  {
    field: 'address',
    label: '具体地址',
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'latitude',
    label: '经纬度',
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
    width: '100px',
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

const onDelRow = async (row: VillageDtoType | null, multiple: boolean) => {
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

const onEditRow = (row: VillageDtoType) => {
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
</script>
