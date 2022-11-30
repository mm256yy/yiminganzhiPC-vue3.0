<template>
  <ContentWrap title="农户信息登记">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px">
        <ElButton :icon="addIcon" type="primary" @click="onAddRow">模版下载</ElButton>
        <ElButton :icon="addIcon" type="primary" @click="onAddRow">批量导入</ElButton>
        <ElButton :icon="addIcon" type="primary" @click="onAddRow">追加导入</ElButton>
      </div>
      <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增角色</ElButton>
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
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditRow(row)" @delete="onDelRow" />
      </template>
    </Table>
    <RoleEditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
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
import RoleEditForm from './components/RoleEditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  searchRoleListApi,
  deleteRoleApi,
  createRoleApi,
  updateRoleApi
} from '@/api/sys/role/service'
import type { RoleType } from '@/api/sys/role/types'

// type LabelValueType = { label: string; id: number; children?: LabelValueType[] }

const appStore = useAppStore()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: searchRoleListApi,
  delListApi: deleteRoleApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId: appStore.currentProjectId
}

getList()

onMounted(() => {
  // 权限限制
  if (!appStore.getIsProjectAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {
        window.location.href = '/#/dashboard/home'
      })
    return
  }
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '户主姓名',
    search: {
      show: true,
      component: 'Input'
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
    field: 'code',
    label: '户号',
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
    field: 'villageName',
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
    field: 'natural',
    label: '自然村名称',
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
    field: 'telphone',
    label: '联系方式'
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: '130px',
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

const onDelRow = async (row: RoleType | null, multiple: boolean) => {
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

const onEditRow = (row: RoleType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: RoleType) => {
  if (actionType.value === 'add') {
    await createRoleApi(data)
  } else {
    await updateRoleApi({
      ...data,
      id: tableObject.currentRow?.id as number
    })
  }
  ElMessage.success('操作成功！')
  dialog.value = false
  getList()
}
</script>
