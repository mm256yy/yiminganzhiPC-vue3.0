<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
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
        <template #birthday="{ row }">
          <div>
            {{ standardFormatDate(row.birthday) }}
          </div>
        </template>
        <template #action="{ row }">
          <el-button type="primary" link @click="onViewRow(row)">详情</el-button>
          <el-button type="primary" link @click="onEditRow(row)">核定</el-button>
          <el-button v-if="row.relation != 1" type="danger" link @click="onDelRow(row)">
            删除
          </el-button>
        </template>
      </Table>
    </div>

    <!-- 删除弹窗 -->
    <el-dialog title="删除人员信息" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        <el-icon><InfoFilled /></el-icon>是否删除
        <span style="margin: 0 6px; font-weight: 600">{{ tableObject.currentRow?.name }}</span>
        的信息
      </div>
      <span style="position: absolute; top: 125px; left: 60px; color: red">*</span>
      <ElFormItem label="删除原因" prop="reason">
        <ElSelect clearable filterable v-model="reason" class="!w-full">
          <ElOption
            v-for="item in dictObj[367]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :doorNo="props.doorNo"
      :baseInfo="props.baseInfo"
      @close="onFormPupClose"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref, computed, watch } from 'vue'
// ElMessage
import {
  ElButton,
  ElSpace,
  ElDialog,
  ElFormItem,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import { Table } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDemographicListApi } from '@/api/workshop/population/service'
import { delDemographicApi } from '@/api/putIntoEffect/putIntoEffectDataFill/populationCheck/service'
import { DelDemographicDtoType } from '@/api/putIntoEffect/putIntoEffectDataFill/populationCheck/types'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { standardFormatDate } from '@/utils/index'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const emit = defineEmits(['refresh'])
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
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
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'relationText',
    label: '与户主关系',
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
    field: 'censusTypeText',
    label: '户籍册类别',
    search: {
      show: false
    }
  },
  {
    width: 180,
    field: 'card',
    label: '身份证号',
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
    field: 'populationNatureText',
    label: '人口性质',
    search: {
      show: false
    }
  },
  {
    field: 'checkRemark',
    label: '备注',
    search: {
      show: false
    }
  },
  {
    field: 'addReasonText',
    label: '新增原因',
    search: {
      show: false
    }
  },
  {
    field: 'deleteReasonText',
    label: '删除原因',
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
const dialogVisible = ref(false)
const reason = ref()
const onClose = () => {
  reason.value = ''
  dialogVisible.value = false
}
const onSubmit = () => {
  if (!reason.value) {
    ElMessage.warning('请选择删除原因')
    return
  }
  const params: DelDemographicDtoType = {
    id: tableObject.currentRow?.id as number,
    reason: reason.value
  }
  delDemographicApi(params).then(() => {
    ElMessage.success('操作成功')
    getList()
  })
  dialogVisible.value = false
}
const onDelRow = (row: DemographicDtoType) => {
  dialogVisible.value = true
  tableObject.currentRow = row
}

const tableLength: any = computed(() => {
  return tableObject?.tableList?.length > 0 ? tableObject?.tableList?.length : []
})
watch(tableLength, () => {
  emit('refresh')
})

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = (row: DemographicDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = {
    ...row,
    occupation: row.occupation ? JSON.parse(row.occupation) : '',
    insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  }
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

const onViewRow = (row: DemographicDtoType) => {
  actionType.value = 'view'
  tableObject.currentRow = {
    ...row,
    occupation: row.occupation ? JSON.parse(row.occupation) : '',
    insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  }
  dialog.value = true
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
