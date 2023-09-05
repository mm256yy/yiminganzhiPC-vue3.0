<template>
  <ElDialog
    title="查看"
    :model-value="props.show"
    :width="800"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
      label-suffix=":"
    >
      <ElFormItem v-if="isHouseHold" label="户主" prop="household"> 张三 </ElFormItem>
      <ElFormItem v-if="isHouseHold" label="户号" prop="accountNumber"> aaaa </ElFormItem>

      <ElFormItem v-if="isVillage" label="村集体" prop="household"> 张三 </ElFormItem>
      <ElFormItem v-if="isVillage" label="村集体编号" prop="accountNumber"> aaaa </ElFormItem>

      <ElFormItem v-if="isOther" label="名称" prop="household"> 张三 </ElFormItem>
      <ElFormItem v-if="isOther" label="资金科目" prop="accountNumber"> aaaa </ElFormItem>

      <ElFormItem v-if="!isOther" label="所属区域" prop="area"> 所属区域文本 </ElFormItem>

      <ElFormItem label="到账金额" prop="amountReceived"> 到账金额文本 </ElFormItem>
      <ElFormItem label="金额(元)" prop="amount"> 金额文本 </ElFormItem>
      <ElFormItem label="发放金额" prop="issuedAmount"> 1000 </ElFormItem>
      <div class="table-wrap">
        <Table
          border
          :loading="false"
          :data="tableObject.tableList"
          :columns="allSchemas.tableColumns"
          tableLayout="auto"
          headerAlign="center"
          align="center"
          highlightCurrentRow
          @register="register"
        >
          <template #proof>
            <div class="proof-container">
              <ElImage :src="avatarSrc" @click="onShowImage" alt="相关凭证"
            /></div>
          </template>
        </Table>
      </div>
    </ElForm>
    <el-dialog title="查看图片" :width="600" v-model="dialogVisible">
      <img class="block w-full" :src="avatarSrc" alt="Preview Image" />
    </el-dialog>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, FormInstance, FormRules, ElImage } from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import avatarSrc from '@/assets/imgs/done_icon.png'

interface PropsType {
  show: boolean
  type: number // 类型
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()

const form = ref<any>({})
const dialogVisible = ref<boolean>(false)

const isHouseHold = computed(() => {
  return props.type === 1
})

const isVillage = computed(() => {
  return props.type === 2
})

const isOther = computed(() => {
  return props.type === 3
})

const onShowImage = () => {
  dialogVisible.value = true
}

const { register, tableObject } = useTable()

tableObject.tableList = [
  {
    index: '1',
    issueDate: '123',
    amount: '100',
    instructions: '100'
  }
]

// 规则校验
const rules = reactive<FormRules>({})

const initData = () => {}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 预览
// const imgPreview = (uploadFile: UploadFile) => {
//   imgUrl.value = uploadFile.url!
//   dialogVisible.value = true
// }

onMounted(() => {
  initData()
})

const schema = reactive<CrudSchema[]>([
  // table字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'issueDate',
    label: '发放日期',
    search: {
      show: false
    }
  },
  {
    field: 'amount',
    label: '金额（元）',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'instructions',
    label: '说明',
    search: {
      show: false
    }
  },
  {
    field: 'proof',
    label: '相关凭证',
    align: 'center',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
</script>

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label-required {
    display: inline-flex;
    width: 150px;
    height: 32px;
    padding: 0 12px 0 0;
    font-size: 14px;
    line-height: 32px;
    color: #606266;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;

    &::before {
      margin-right: 4px;
      color: #f56c6c;
      content: '*';
    }
  }
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}

.proof-container {
  width: 50px;
  height: 50px;
  padding: 10px;
  margin: 0 auto;
}
</style>
