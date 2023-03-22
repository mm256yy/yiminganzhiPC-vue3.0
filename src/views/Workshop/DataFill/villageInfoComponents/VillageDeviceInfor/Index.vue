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
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        :pagination="{
          total: tableObject.total
        }"
        highlightCurrentRow
        @register="register"
      >
        <template #completedTime="{ row }">
          <div>
            {{ standardFormatDate(row.completedTime) }}
          </div>
        </template>
        <template #locationType="{ row }">
          <div>
            {{ getLocationText(row.locationType) }}
          </div>
        </template>
        <template #action="{ row }">
          <TableEditColumn
            :view-type="'link'"
            :icons="[
              {
                icon: '',
                tooltip: '详情',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
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
      :doorNo="props.doorNo"
      :householdId="props.householdId"
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
import { standardFormatDate } from '@/utils/index'
import {
  getFruitwoodListApi,
  deleteDevicel
} from '@/api/workshop/datafill/immigrantFacilities-service'
// import { DemographicDtoType } from '@/api/workshop/population/types'
// import { formatDate } from '@/utils/index'
import { locationTypes } from '@/views/Workshop/components/config'
interface PropsType {
  doorNo: string
  householdId
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getFruitwoodListApi,
  delListApi: deleteDevicel
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
}

getList()
const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
}
const schema = reactive<CrudSchema[]>([
  {
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'facilitiesName',
    label: '设施名称',
    search: {
      show: false
    }
  },
  {
    field: 'facilitiesType',
    label: '设施类别',
    search: {
      show: false
    }
  },
  {
    field: 'number',
    label: '数量',
    search: {
      show: false
    }
  },
  {
    field: 'unitText',
    label: '单位',
    search: {
      show: false
    }
  },
  {
    field: 'locationType',
    label: '所在位置',
    search: {
      show: false
    }
  },
  {
    field: 'specificLocation',
    label: '具体位置',
    search: {
      show: false
    }
  },
  {
    field: 'competentUnit',
    label: '主管单位',
    search: {
      show: false
    }
  },
  {
    field: 'completedTime',
    label: '建成年月',
    search: {
      show: false
    }
  },
  {
    field: 'scopes',
    label: '规模',
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

const onDelRow = async (row: any | null, multiple: boolean) => {
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

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

const onViewRow = (row: any) => {
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}
</script>
