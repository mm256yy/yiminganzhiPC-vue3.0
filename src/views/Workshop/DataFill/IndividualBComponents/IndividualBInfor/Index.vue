<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace />
      </div>
      <Table
        v-if="false"
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
        <template #birthday="{ row }">
          <div>
            {{ formatDate(row.birthday) }}
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

      <div class="emptyBox" v-if="emptyShow">
        <img src="@/assets/imgs/empty.png" alt="" width="400" />
        <span
          >当前个体工商户未进行数据填报，请<span
            style="color: rgba(62, 115, 236, 1); cursor: pointer; border-bottom: 1px solid"
            @click="onAddRow"
            >点击填报</span
          >
        </span>
      </div>
    </div>

    <EditForm
      :householdId="props.householdId"
      :show="dialog"
      :actionType="actionType"
      :rowdata="tableObject.currentRow"
      :doorNo="props.doorNo"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref, onMounted } from 'vue'
import { ElSpace } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'

import { getDemographicListApi, delDemographicByIdApi } from '@/api/workshop/IndividualB/service'
import { DemographicDtoType } from '@/api/workshop/population/types'
import { formatDate } from '@/utils/index'

interface PropsType {
  doorNo: string
  householdId
}

const emptyShow = ref<boolean>(false)
const props = defineProps<PropsType>()
const dialog = ref(true) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型

//

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
}

onMounted(async () => {
  await getList()
  if (tableObject.total > 0) {
    emptyShow.value = false
    dialog.value = true
    tableObject.currentRow = tableObject.tableList[0]
    actionType.value = 'edit'
  } else {
    dialog.value = false
    emptyShow.value = true
    actionType.value = 'add'
  }
})

const schema = reactive<CrudSchema[]>([
  {
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'sexText',
    label: '性别',
    search: {
      show: false
    }
  },
  {
    field: 'birthday',
    label: '出生年月',
    search: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'nationText',
    label: '民族',
    search: {
      show: false
    }
  },
  {
    field: 'censusRegister',
    label: '户籍所在地',
    search: {
      show: false
    }
  },
  {
    field: 'educationText',
    label: '文化程度',
    search: {
      show: false
    }
  },
  {
    field: 'maritalText',
    label: '婚姻状况',
    search: {
      show: false
    }
  },
  {
    field: 'occupationText',
    label: '职业',
    search: {
      show: false
    }
  },
  {
    field: 'company',
    label: '工作单位',
    search: {
      show: false
    }
  },
  {
    field: 'insuranceTypeText',
    label: '参保情况',
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

const onDelRow = async (row: DemographicDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}

// 延迟使用，因为还没挂载

const onEditRow = (row: DemographicDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}
const onAddRow = () => {
  emptyShow.value = false
  dialog.value = true
}

const onViewRow = (row: DemographicDtoType) => {
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}
</script>
<style lang="less">
.emptyBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
