<template>
  <view class="table-wrap">
    <div class="flex items-center justify-between pb-12px">
      <div class="table-left-title pl-20px"> 合同列表 </div>
      <ElButton style="margin-right: 20px" :icon="addIcon" type="primary" @click="onAddRow">
        添加
      </ElButton>
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
      style="margin: 0 20px"
      @register="register"
    >
      <template #startDate="{ row }">
        {{ row.startDate ? dayjs(row.startDate).format('YYYY-MM-DD') : '-' }}
      </template>
      <template #endDate="{ row }">
        {{ row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : '-' }}
      </template>
      <template #action="{ row }">
        <TableEditColumn
          :row="row"
          :view-type="'link'"
          :icons="[
            {
              icon: 'ant-design:delete-outlined',
              tooltip: '查看',
              type: 'default',
              disabled: false,
              action: () => onViewRow(row)
            }
          ]"
          @edit="onEditRow(row)"
          @delete="onDelRow"
          :delete="row.delFlag"
        />
      </template>
    </Table>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :professionalId="props.professionalId"
      :row="tableObject.currentRow"
      @close="onFormPupClose"
    />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElButton } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getProfessionalContractApi,
  getProfessionalContractByIdApi,
  delProfessionalContractByIdApi
} from '@/api/professional/service'
import type { ProfessionalContractDtoType } from '@/api/professional/types'
import dayjs from 'dayjs'
import EditForm from './EditForm.vue'

interface PropsType {
  professionalId: number
}

const { register, tableObject, methods } = useTable({
  getListApi: getProfessionalContractApi,
  delListApi: delProfessionalContractByIdApi
})
const { getList } = methods
const props = defineProps<PropsType>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId

tableObject.params = {
  projectId,
  professionalId: props.professionalId,
  status: 'implementation'
}

getList()

const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const actionType = ref<'add' | 'edit' | 'view'>('add')
const dialog = ref(false) // 弹窗标识

const schema = reactive<CrudSchema[]>([
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'contractName',
    label: '合同名称',
    search: {
      show: false
    }
  },
  {
    field: 'contractCode',
    label: '合同编号',
    search: {
      show: false
    }
  },
  {
    field: 'contractAmount',
    label: '合同金额',
    search: {
      show: false
    }
  },
  {
    field: 'startDate',
    label: '合同开始时间',
    search: {
      show: false
    }
  },
  {
    field: 'endDate',
    label: '合同终止时间',
    search: {
      show: false
    }
  },

  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 250,
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

const onDelRow = async (row: ProfessionalContractDtoType, multiple: boolean) => {
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

const onEditRow = async (row: ProfessionalContractDtoType) => {
  const res = await getProfessionalContractByIdApi(row.id)
  if (res) {
    actionType.value = 'edit'
    tableObject.currentRow = res
    dialog.value = true
  }
}

const onViewRow = async (row: ProfessionalContractDtoType) => {
  const res = await getProfessionalContractByIdApi(row.id)
  if (res) {
    actionType.value = 'view'
    tableObject.currentRow = res
    dialog.value = true
  }
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}
</script>

<style lang="less" scoped></style>
