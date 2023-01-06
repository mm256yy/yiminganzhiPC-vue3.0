<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
          <ElButton :icon="printIcon" type="default" @click="() => {}">打印表格</ElButton>
        </ElSpace>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #action="{ row }">
          <TableEditColumn
            :icons="[
              {
                icon: '',
                tooltip: '详情',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
            :view-type="'link'"
            :row="row"
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
      :district-tree="[]"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElMessage, ElSpace } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getHouseListApi,
  addHouseApi,
  updateHouseApi,
  delHouseByIdApi
} from '@/api/workshop/datafill/house-service'
import type { HouseDtoType } from '@/api/workshop/datafill/house-types'

interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()

const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const printIcon = useIcon({ icon: 'ion:print-outline' })

const { register, tableObject, methods } = useTable({
  getListApi: getHouseListApi,
  delListApi: delHouseByIdApi
})
const { getList } = methods

tableObject.params = {
  doorNo: props.doorNo
}

getList()

const schema = reactive<CrudSchema[]>([
  {
    field: 'index',
    type: 'index',
    fixed: true,
    label: '序号'
  },
  {
    field: 'houseNo',
    label: '幢号',
    fixed: true,
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'propertyType',
    label: '房屋产别',
    width: 120,
    search: {
      show: false
    }
  },

  {
    field: 'usageType',
    label: '房屋用途',
    width: 120,
    search: {
      show: false
    }
  },
  {
    field: 'houseType',
    label: '房屋类别',
    width: 154,
    search: {
      show: false
    }
  },
  {
    field: 'constructionType',
    label: '结构类型',
    width: 154,
    search: {
      show: false
    }
  },
  {
    field: 'storeyNumber',
    label: '层数',
    width: 100,
    search: {
      show: false
    }
  },

  {
    field: 'completedTime',
    label: '竣工年月',
    width: 130,
    search: {
      show: false
    }
  },
  {
    field: 'propertyNo',
    label: '房产所有权证编号',
    width: 258,
    search: {
      show: false
    }
  },
  {
    field: 'landNo',
    label: '土地使用权证编号',
    width: 258,
    search: {
      show: false
    }
  },
  {
    field: 'landType',
    label: '土地性质',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'landArea',
    label: '建筑面积(m²)',
    width: 120,
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 150,
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

const onDelRow = async (row: HouseDtoType | null, multiple: boolean) => {
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

const onEditRow = (row: HouseDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: HouseDtoType) => {
  if (actionType.value === 'add') {
    await addHouseApi({
      ...data,
      doorNo: props.doorNo,
      householdId: +props.householdId
    })
  } else {
    await updateHouseApi({
      ...data,
      id: tableObject.currentRow?.id as number,
      doorNo: props.doorNo,
      householdId: +props.householdId
    })
  }
  ElMessage.success('操作成功！')
  dialog.value = false
  getList()
}

const onViewRow = (row) => {
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}
</script>
