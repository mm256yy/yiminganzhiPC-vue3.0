<template>
  <ContentWrap title="网格维护">
    <div class="flex justify-between mb-10px">
      <div class="flex">
        <Search
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </div>
    </div>
    <div class="table-wrap">
      <div style="margin-bottom: 5px; text-align: right">
        <ElButton type="primary" @click="onAddRow">新增网格</ElButton>
        <ElButton type="primary" @click="download">网格模板下载</ElButton>
        <ElButton type="primary" @click="fenpeiClick">一键分配</ElButton>
      </div>
      <ContentWrap>
        <Table
          v-model:pageSize="tableObject.size"
          v-model:currentPage="tableObject.currentPage"
          :pagination="{
            total: tableObject.total
          }"
          :loading="tableObject.loading"
          :data="tableObject.tableList"
          :columns="allSchemas.tableColumns"
          :showOverflowTooltip="true"
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
          <template #createdDate="{ row }">
            <div>{{ formatDate(row.createdDate) }}</div>
          </template>
          <template #action="{ row }">
            <TableEditColumn
              :row="row"
              :view-type="'link'"
              @edit="onEditRow(row)"
              @delete="onDelRow"
            />
            <span
              :style="{ color: '#3e73ec', cursor: 'pointer', marginLeft: '5px', fontSize: '12px' }"
              >已分配网络</span
            >
          </template>
        </Table>
      </ContentWrap>
    </div>
    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :districtTree="districtTree2"
      @close="onFormPupClose"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
// import { useIcon } from '@/hooks/web/useIcon'
import { getVillageListApi, delVillageByIdApi } from '@/api/workshop/village/service'
import { getDistrictTreeApi } from '@/api/district'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import type { VillageDtoType } from '@/api/workshop/village/types'
import { formatDate } from '@/utils'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'fenpei'>('add') // 操作类型
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const districtTree = ref()
const districtTree2 = ref()
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
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const getDistrictTree2 = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree2.value = list || []
  return list || []
}

onMounted(() => {
  getDistrictTree()
  getDistrictTree2()
})

const schema = reactive<CrudSchema[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },

  {
    field: 'area',
    label: '网格名称',
    search: {
      show: true
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'villageText',
    label: '行政村名称',
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
    field: 'village',
    label: '网格工作人员',
    search: {
      show: true
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
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择县\街道\行政村\自然村',
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
const download = () => {
  window.open()
}
const fenpeiClick = () => {
  actionType.value = 'fenpei'
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
