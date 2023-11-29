<template>
  <ElDialog
    :title="actionType == 'view' ? '查看' : '审核'"
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
      label-width="150px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="被留言对象类型:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="被留言对象id:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="留言提交人:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="留言提交人id:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="留言人所在行政村:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="留言位置:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="提交时间:">
        {{ form.amount }}
      </ElFormItem>
      <ElFormItem label="留言内容:">
        {{ form.amount }}
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton type="primary" @click="onSubmit(formRef, 0)" v-if="actionType == 'edit'"
        >通过</ElButton
      >
      <ElButton type="danger" @click="onSubmit(formRef, 1)" v-if="actionType == 'edit'"
        >驳回</ElButton
      >
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  FormInstance,
  FormRules,
  ElUpload,
  ElSelect,
  ElOption,
  ElMessage,
  ElMessageBox,
  ElInput,
  ElInputNumber,
  ElDatePicker
} from 'element-plus'
import { ref, reactive, watch, computed } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { addFundEntryApi, updateFundEntryApi } from '@/api/fundManage/fundEntry-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useValidator } from '@/hooks/web/useValidator'
import dayjs from 'dayjs'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { required } = useValidator()

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const receipt = ref<FileItemType[]>([]) // 搬迁安置确认单文件列表

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  source: [required()],
  amount: [required()],
  recordTime: [required()]
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      if (props.actionType === 'edit') {
        // 编辑
        form.value = {
          ...props.row
        }
        if (props.row.receipt) {
          receipt.value = JSON.parse(props.row.receipt)
        }
        if (form.value.recordTime) {
          form.value.recordTime = dayjs(form.value.recordTime).format('YYYY-MM-DD')
        }
      } else {
        // 新增
        form.value = {}
        receipt.value = []
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  formRef.value?.resetFields()
  form.value = {}
  receipt.value = []
}

const submit = async (data: any) => {
  if (props.actionType === 'edit') {
    await addFundEntryApi(data)
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl, status: number) => {
  if (status === 0) {
    let params: any = {
      ...form.value
    }
    submit(params)
    return
  }
  formEl?.validate((valid: any) => {
    if (valid) {
      let params: any = {
        ...form.value
      }
      submit(params)
    } else {
      return false
    }
  })
})
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
</style>
