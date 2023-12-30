<template>
  <ElDialog
    title="详情"
    :model-value="props.show"
    :width="1400"
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
      <template #grantTime="{ row }">
        <div>{{ row.grantTime ? dayjs(row.grantTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div>
      </template>
      <template #type="{ row }">
        <div>{{ `第${row.type}批次` }}</div>
      </template>
      <template #grantStatus="{ row }">
        <div>{{ row.grantStatus == '1' ? '已放款' : '未放款' }}</div>
      </template>
    </Table>
  </ElDialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import { getfindByDoorNoAndType } from '@/api/fundManage/fundPayment-service'
import { ElDialog } from 'element-plus'
interface PropsType {
  show: boolean
  id: any
}
const emit = defineEmits(['close', 'submit'])
const props = defineProps<PropsType>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
const { register, tableObject, methods } = useTable({
  getListApi: getfindByDoorNoAndType
})
const { setSearchParams } = methods

tableObject.params = {
  projectId,
  ...props.id
}

const onClose = (flag = false) => {
  emit('close', flag)
}
const schema = reactive<CrudSchema[]>([
  // table
  {
    width: 80,
    field: 'type',
    label: '类型'
  },
  {
    field: 'name',
    label: '指标名称',
    search: {
      show: false
    }
  },
  {
    field: 'totalPrice',
    label: '金额（元）',
    search: {
      show: false
    }
  },
  {
    field: 'grantStatus',
    label: '是否发放',
    search: {
      show: false
    }
  },
  {
    field: 'grantTime',
    label: '发放日期',
    search: {
      show: false
    }
  },

  {
    field: 'grantUser',
    label: '发放人',
    search: {
      show: false
    }
  }
])
let { allSchemas } = useCrudSchemas(schema)
watch(
  () => props.show,
  (val) => {
    if (val) {
      setSearchParams({ ...props.id })
    }
  }
)
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
