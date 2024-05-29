<template>
  <ElDialog
    title="详情"
    :model-value="props.show"
    :width="1100"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <Table
      ref="tabalRef"
      :loading="tableObject.loading"
      :data="tableObject.tableList"
      :columns="allSchemas.tableColumns"
      row-key="id"
      headerAlign="center"
      align="center"
      highlightCurrentRow
      @register="register"
      height="500"
    >
      <template #operationType="{ row }">
        {{ row.operationType == 1 ? '分户' : '合户' }}
      </template>
      <template #operationDate="{ row }">
        {{ row.operationDate ? dayjs(row.operationDate).format('YYYY-MM-DD') : '' }}
      </template>
    </Table>
  </ElDialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import { getSeparateLog } from '@/api/fundManage/fundPayment-service'
import { ElDialog } from 'element-plus'
// import { useDictStoreWithOut } from '@/store/modules/dict'
interface PropsType {
  show: boolean
  id: number
}
const emit = defineEmits(['close', 'submit'])
const props = defineProps<PropsType>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
let dataForm = ref<any[]>([])
const { register, tableObject, methods } = useTable({
  getListApi: getSeparateLog
})
const { getList } = methods

// let getFindByDoorNoAsync = async () => {
//   const data: any = await getSeparateLog({ operationType: props.id })
//   console.log(data, 'bbq')
//   dataForm.value = data
// }

const onClose = (flag = false) => {
  emit('close', flag)
}

watch(
  () => props.show,
  () => {
    // getFindByDoorNoAsync()
    tableObject.params = {
      operationType: props.id
    }
    getList()
  }
)
const schema = reactive<CrudSchema[]>([
  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    width: 80,
    field: 'operationType',
    label: '操作类型',
    search: {
      show: false
    }
  },
  {
    field: 'sourceDoor',
    label: '操作前数据',
    search: {
      show: false
    }
  },
  {
    field: 'targetDoor',
    label: '操作后数据',
    search: {
      show: false
    }
  },
  {
    field: 'operationDate',
    label: '操作时间',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'operationBy',
    label: '操作人',
    search: {
      show: false
    }
  },
  {
    field: 'houseSeparateReasonText',
    label: '分权原因',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    search: {
      show: false
    }
  }
])
let { allSchemas } = useCrudSchemas(schema)
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}

.ElButton-form-wrap {
  display: block;
  padding: var(--distance-base);
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.numFont {
  font-size: 14px;
}
</style>
