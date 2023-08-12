<template>
  <WorkContentWrap>
    <!-- 安置确认 —— 坟墓安置 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onFilling">填报完成</ElButton>
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
        <template #birthday="{ row }">
          <div>
            {{ standardFormatDate(row.birthday) }}
          </div>
        </template>
        <template #action="{ row }">
          <TableEditColumn
            :view-type="'link'"
            :icons="[
              {
                icon: '',
                tooltip: '确认',
                type: 'primary',
                action: () => onEditRow(row)
              }
            ]"
            :row="row"
            @delete="onDelRow"
            :delete="true"
            :edit="false"
          />
        </template>
        <template #relation="{ row }">
          {{ dictFmt(row.relation, 307) }}
        </template>

        <template #settingGrave="{ row }">
          {{ row.handleWay === '1' ? row.settingAddress : dictFmt(row.settingGrave, 377) }}
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :doorNo="props.doorNo"
      @close="onFormPupClose"
      :baseInfo="props.baseInfo"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref, computed } from 'vue'
import { ElButton, ElSpace, ElMessage } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { saveFillingCompleteApi } from '@/api/immigrantImplement/common-service'
import {
  getGraveArrageListApi,
  delGraveArrageApi
} from '@/api/immigrantImplement/resettleConfirm/grave-service'
import { standardFormatDate } from '@/utils/index'
import { useDictStoreWithOut } from '@/store/modules/dict'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { register, tableObject, methods } = useTable({
  getListApi: getGraveArrageListApi,
  delListApi: delGraveArrageApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  registrantDoorNo: props.doorNo,
  householdId: props.baseInfo.id,
  projectId: props.baseInfo.projectId,
  status: props.baseInfo.status
}

getList()

const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'relation',
    label: '坟墓与登记人关系',
    search: {
      show: false
    }
  },
  {
    field: 'graveTypeText',
    label: '穴位',
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
    field: 'handleWayText',
    label: '处理方式',
    search: {
      show: false
    }
  },
  {
    width: 180,
    field: 'settingGrave', // settingAddress
    label: '安置公墓/详细地址',
    search: {
      show: false
    }
  },
  {
    field: 'settingRemark',
    label: '备注',
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

const dictFmt = (value, index) => {
  if (value && dictObj.value[index] && dictObj.value[index].length > 0) {
    const item = dictObj.value[index].find((item: any) => item?.value === value)
    return item ? item.label : value
  }
}
const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

const onEditRow = (row: any) => {
  actionType.value = 'edit'
  tableObject.currentRow = {
    ...row
  }
  dialog.value = true
}

// 填报完成
const onFilling = () => {
  saveFillingCompleteApi({
    doorNo: props.doorNo,
    graveArrangementStatus: '1'
  }).then((res: any) => {
    if (res) {
      ElMessage.success('操作成功')
    }
  })
}
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}
</style>
