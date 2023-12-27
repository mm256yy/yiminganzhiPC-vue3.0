<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑合同' : actionType === 'add' ? '新增合同' : '查看详情'"
    :model-value="props.show"
    :width="700"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      :disabled="actionType === 'view'"
      class="form"
      ref="formRef"
      :model="form"
      :label-width="100"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="合同名称" prop="contractName">
        <ElInput v-model="form.contractName" placeholder="请输入合同名称" />
      </ElFormItem>

      <ElFormItem label="合同编号" prop="contractCode">
        <ElInput class="!w-350px" v-model="form.contractCode" placeholder="请输入合同编号" />
      </ElFormItem>
      <ElFormItem label="合同金额" prop="contractAmount">
        <ElInputNumber
          class="!w-350px"
          v-model="form.contractAmount"
          placeholder="请输入合同金额"
          :precision="2"
          :step="0.1"
          controls-position="right"
        />
      </ElFormItem>
      <ElFormItem label="起止时间" prop="time">
        <ElDatePicker
          class="!w-full"
          v-model="form.time"
          type="daterange"
          placeholder="请选择日期"
        />
      </ElFormItem>

      <ElFormItem label="支付节点" prop="nodeDtoList">
        <div class="node-list">
          <div class="node-item" v-for="(item, index) in nodeList" :key="index">
            <div class="label"> 支付日期： </div>
            <ElDatePicker
              class="!w-175px"
              v-model="item.paymentDate"
              type="date"
              placeholder="请选择日期"
            />
            <div class="label ml-15px"> 支付金额： </div>
            <ElInputNumber
              class="!w-175px"
              v-model="item.amount"
              placeholder="请输入金额"
              :precision="2"
              :step="0.1"
              controls-position="right"
            />

            <el-button
              v-if="actionType !== 'view'"
              type="primary"
              class="ml-10px"
              :icon="minusIcon"
              circle
              @click="minusRow(index)"
            />
          </div>

          <el-button v-if="actionType !== 'view'" type="primary" :icon="addIcon" @click="addRow"
            >添加一行</el-button
          >
        </div>
      </ElFormItem>
      <ElFormItem v-if="actionType === 'view'" label="支付时间" prop="paymentNodeList">
        <div class="node-list">
          <div class="node-item" v-for="(item, index) in paymentTimeList" :key="index">
            <div class="label"> {{ item.createdDate }}</div>
            <div class="label ml-15px"> 金额： {{ item.amount }} 元</div>
            <div class="ml-15px">凭证:</div>
            <div class="item-receipt">
              <div
                class="receipt-url"
                v-for="(i, j) in getImageUrlItem(item.receipt)"
                :key="j"
                @click="onImageClick(i.url)"
              >
                <ElImage :src="getImageUrl(i.url)" fit="cover" alt="凭证图片" />
              </div>
            </div>
          </div>
        </div>
      </ElFormItem>
    </ElForm>
    <template v-if="actionType !== 'view'" #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)" :loading="btnLoading">确认</ElButton>
    </template>
    <el-dialog title="查看图片" append-to-body :width="350" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElMessage,
  ElDatePicker,
  ElInputNumber,
  ElImage
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { editProfessionalContractApi } from '@/api/professional/service'
import type { ProfessionalContractDtoType, NodeDto, PaymentNode } from '@/api/professional/types'
import { useIcon } from '@/hooks/web/useIcon'
import dayjs from 'dayjs'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: ProfessionalContractDtoType | null | undefined
  professionalId: number
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const btnLoading = ref(false)
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const minusIcon = useIcon({ icon: 'ant-design:minus-outlined' })
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const commonParams = {
  projectId,
  status: 'implementation'
}

// nodeItem 默认值
const defaultNodeItem: Partial<NodeDto> = {
  ...commonParams,
  amount: 0,
  paymentDate: ''
}

const nodeList = ref<Partial<NodeDto>[]>([])

const getImageUrlItem = (data: string) => {
  const imgItem = data ? JSON.parse(data) : {}
  return imgItem
}

const getImageUrl = (url: string) => {
  console.log('img-url', url)
  return url
}

const onImageClick = (url) => {
  imgUrl.value = url
  dialogVisible.value = true
}

const paymentTimeList = ref<PaymentNode[]>([])

const defaultValue: Partial<ProfessionalContractDtoType> & { time: any } = {
  ...commonParams,
  contractName: '',
  professionalId: props.professionalId,
  contractCode: '',
  contractAmount: 0,
  time: [],
  nodeDtoList: []
}
const form = ref<Partial<ProfessionalContractDtoType> & { time: any }>(defaultValue)

watch(
  () => props.show,
  (val) => {
    btnLoading.value = false
    if (val) {
      if (props.actionType !== 'add') {
        const { startDate, endDate, nodeDtoList, paymentNodeList } = props.row as any
        form.value = { ...props.row, time: [dayjs(startDate), dayjs(endDate)] }
        nodeList.value = nodeDtoList || []
        paymentTimeList.value = paymentNodeList || []
      } else {
        form.value = { ...defaultValue, time: [] }
      }
    }
  }
)

// 规则校验
const rules = reactive<FormRules>({
  contractName: [required()],
  contractCode: [required()]
})

const addRow = () => {
  const addItem = { ...defaultNodeItem }
  if (props.row) {
    addItem.contractId = props.row.id
  }
  if (!nodeList.value.length) {
    nodeList.value.push(addItem)
    return
  }
  const lastlen = nodeList.value.length - 1

  if (!nodeList.value[lastlen].amount || !nodeList.value[lastlen].paymentDate) {
    ElMessage.info('最后一行未填写')
    return
  }
  nodeList.value.push(addItem)
}

const minusRow = (index) => {
  nodeList.value.splice(index, 1)
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  formRef.value?.resetFields()
  nodeList.value = []
  form.value = { ...defaultValue, time: [] }
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      const data: any = {
        ...form.value,
        startDate: form.value.time[0],
        endDate: form.value.time[1]
      }
      data.professionalId = props.professionalId
      data.nodeDtoList = nodeList.value
      delete data.time
      submit(data)
    } else {
      return false
    }
  })
}, 600)

const submit = async (data: ProfessionalContractDtoType) => {
  await editProfessionalContractApi({
    ...commonParams,
    ...data
  }).catch(() => {
    btnLoading.value = false
  })
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}
</script>

<style lang="less">
.form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}

.node-list {
  overflow-y: auto;

  .node-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    .item-receipt {
      margin-left: 20px;
      overflow-y: auto;
      cursor: pointer;

      .receipt-url {
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>
