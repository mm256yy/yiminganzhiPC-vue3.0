<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
        </ElSpace>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #completedTime="{ row }">
          <div>
            {{ formatDate(row.completedTime) }}
          </div>
        </template>
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
      :householdId="props.householdId"
      :doorNo="props.doorNo"
      @close="onFormPupClose"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElSpace } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getHouseListApi, delHouseByIdApi } from '@/api/workshop/datafill/house-service'
import type { HouseDtoType } from '@/api/workshop/datafill/house-types'
import { formatDate } from '@/utils/index'

interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()

const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

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
    label: '序号'
  },
  {
    field: 'houseNo',
    label: '幢号',
    search: {
      show: false
    }
  },
  {
    field: 'propertyTypeText',
    label: '房屋产别',
    search: {
      show: false
    }
  },

  {
    field: 'usageTypeText',
    label: '房屋用途',
    search: {
      show: false
    }
  },
  {
    field: 'houseTypeText',
    label: '房屋类别',
    search: {
      show: false
    }
  },
  {
    field: 'constructionTypeText',
    label: '结构类型',
    search: {
      show: false
    }
  },
  {
    field: 'storeyNumber',
    label: '层数',
    search: {
      show: false
    }
  },

  {
    field: 'completedTime',
    label: '竣工年月',
    search: {
      show: false
    }
  },
  {
    field: 'propertyNo',
    label: '房产所有权证编号',
    search: {
      show: false
    }
  },
  {
    field: 'landNo',
    label: '土地使用权证编号',
    search: {
      show: false
    }
  },
  {
    field: 'landTypeText',
    label: '土地性质',
    search: {
      show: false
    }
  },
  {
    field: 'landArea',
    label: '建筑面积(m²)',
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 130,
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

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

const onViewRow = (row) => {
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}
</script>
