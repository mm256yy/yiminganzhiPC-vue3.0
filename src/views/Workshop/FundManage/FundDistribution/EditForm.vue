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
      :data="dataForm"
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
    <ElForm :model="receiptList">
      <ElFormItem label="凭证编号:"> {{ receiptList.receiptCode }}</ElFormItem>
      <ElFormItem label="凭证文件:">
        <div style="display: flex; justify-content: flex-start">
          <ElImage
            v-for="i in receiptList.receipt"
            :key="i"
            style="width: 100px; height: 100px; margin-right: 10px"
            :src="i"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="receiptList.receipt"
            :initial-index="4"
            fit="cover"
          />
        </div>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import {
  getFindByDoorNo,
  deleteFunPayApi,
  getFindReceiptByDoorNo
} from '@/api/fundManage/fundPayment-service'
import { ElDialog, ElForm, ElFormItem, ElImage } from 'element-plus'
// import { useDictStoreWithOut } from '@/store/modules/dict'
interface PropsType {
  show: boolean
  id: string
}
const emit = defineEmits(['close', 'submit'])
const props = defineProps<PropsType>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
let dataForm = ref<any[]>([])
const headInfo = ref<any>()
const districtTree = ref<any[]>([])
const lpList = ref<any[]>([])
const { register, tableObject, methods } = useTable({
  getListApi: getFindByDoorNo,
  delListApi: deleteFunPayApi
})
const { getList } = methods

tableObject.params = {
  projectId
}
let receiptList: any = ref({ receiptCode: '', receipt: [] })
getList()
let getFindByDoorNoAsync = async () => {
  const data: any = await getFindByDoorNo({ doorNo: props.id })
  console.log(data, 'bbq')
  dataForm.value = data
  let dataList: any = await getFindReceiptByDoorNo({ doorNo: props.id })
  receiptList.value.receiptCode = dataList.receiptCode
  receiptList.value.receipt = []
  if (JSON.parse(dataList.receipt).length > 0) {
    receiptList.value.receipt = JSON.parse(dataList.receipt).reduce((pre, item) => {
      pre.push(item.url)
      return pre
    }, [])
  }
}

const onClose = (flag = false) => {
  emit('close', flag)
}

watch(
  () => props.id,
  () => {
    getFindByDoorNoAsync()
  }
)
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
    width: 160,
    field: 'accountName',
    label: '开户名',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'bankName',
    label: '开户行',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'bankAccount',
    label: '银行账户',
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
