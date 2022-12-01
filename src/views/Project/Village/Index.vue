<template>
  <ContentWrap title="自然村登记">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px"> 自然村列表 </div>
      <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增</ElButton>
    </div>
    <Table
      border
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
        <div>{{ row.latitude }},{{ row.longitude }}</div>
      </template>
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditRow(row)" @delete="onDelRow" />
      </template>
    </Table>
    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :districtTree="districtTree"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getVillageListApi,
  addVillageApi,
  updateVillageApi,
  delVillageByIdApi
} from '@/api/project/village/service'
import { getDistrictTreeApi } from '@/api/district'
import type { VillageDtoType } from '@/api/project/village/types'

// type LabelValueType = { label: string; id: number; children?: LabelValueType[] }

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
  // 权限限制
  if (!appStore.getIsProjectAdmin && !appStore.getIsSysAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {
        window.location.href = '/#/dashboard/home'
      })
    return
  }
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
    label: '行政区划',
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
    label: '村名',
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
    label: '编码',
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
    field: 'introduction',
    label: '简介',
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

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: VillageDtoType) => {
  if (actionType.value === 'add') {
    await addVillageApi({
      ...data,
      projectId
    })
  } else {
    await updateVillageApi({
      ...data,
      id: tableObject.currentRow?.id as number,
      projectId
    })
  }
  ElMessage.success('操作成功！')
  dialog.value = false
  getList()
}
</script>
