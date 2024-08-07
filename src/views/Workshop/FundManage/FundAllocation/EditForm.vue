<template>
  <ElDialog
    title="资金预拨"
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
      <ElFormItem label="资金名称:" required prop="name">
        <ElInput type="text" v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="资金来源:" required prop="source">
        <ElSelect class="w-350px" v-model="form.source">
          <ElOption
            v-for="item in dictObj[388]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="收款方:" required prop="payee">
        <ElSelect class="w-350px" v-model="form.payee">
          <ElOption
            v-for="item in dictObj[395]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="金额(元):" required prop="amount">
        <ElInput type="number" v-model="form.amount" />
      </ElFormItem>
      <ElFormItem label="付款日期:" required prop="recordTime">
        <ElDatePicker type="date" v-model="form.recordTime" />
      </ElFormItem>
      <ElFormItem label="说明:">
        <ElInput type="text" v-model="form.remark" />
      </ElFormItem>
      <ElFormItem label="凭证编号:" required prop="receiptCode">
        <ElInput type="text" v-model="form.receiptCode" />
      </ElFormItem>
      <div class="col-wrapper">
        <div class="col-label-required"> 凭证： </div>
        <div class="card-img-list">
          <ElUpload
            :list-type="'picture-card'"
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            accept=".jpg,.png,jpeg,.pdf"
            :multiple="false"
            :file-list="receipt"
            :headers="headers"
            :on-error="onError"
            :on-success="uploadFileChange1"
            :before-remove="beforeRemove"
            :on-remove="removeFile1"
            :on-preview="imgPreview"
          >
            <template #trigger>
              <div class="card-img-box">
                <img class="card-img" src="@/assets/imgs/house.png" alt="" />
                <div class="card-txt">点击上传</div>
              </div>
            </template>
          </ElUpload>
        </div>
      </div>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef, 0)">保存草稿</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef, 1)">确认提交</ElButton>
    </template>
    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
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
  // ElRow,
  // ElCol,
  ElMessage,
  ElMessageBox,
  ElInput,
  ElDatePicker,
  ElSelect,
  ElOption
} from 'element-plus'
import dayjs from 'dayjs'
import { ref, reactive, nextTick, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { addFundEntryApi, updateFundEntryApi } from '@/api/fundManage/fundEntry-service'
import { useValidator } from '@/hooks/web/useValidator'

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

const form = ref<any>({
  name: '',
  source: '',
  payee: '',
  amount: 0,
  recordTime: '',
  remark: '',
  receiptCode: ''
})
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
  payee: [required()],
  amount: [required()],
  receiptCode: [required()],
  recordTime: [required()]
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
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
  },
  {
    immediate: true,
    deep: true
  }
)

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    receipt.value = []
  })
}

const submit = async (data: any) => {
  if (props.actionType === 'add') {
    data.projectId = appStore.getCurrentProjectId
    data.entryType = '2'
    await addFundEntryApi(data)
  } else {
    await updateFundEntryApi(data)
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl, status: number) => {
  if (status === 0) {
    let params: any = {
      ...form.value,
      receipt: JSON.stringify(receipt.value || []) // 搬迁安置确认单
    }
    params.recordTime = dayjs(params.recordTime)
    params.status = status
    submit(params)
    return
  }
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!receipt.value.length) {
        ElMessage.error('请上传凭证')
        return
      } else {
        let params: any = {
          ...form.value,
          receipt: JSON.stringify(receipt.value || []) // 搬迁安置确认单
        }
        params.recordTime = dayjs(params.recordTime)
        params.status = status
        submit(params)
      }
    } else {
      return false
    }
  })
})

// 处理函数
const handleFileList = (fileList: UploadFiles, type: string) => {
  let list: FileItemType[] = []
  if (fileList && fileList.length) {
    list = fileList
      .filter((fileItem) => fileItem.status === 'success')
      .map((fileItem) => {
        return {
          name: fileItem.name,
          url: (fileItem.response as any)?.data || fileItem.url
        }
      })
  }

  if (type === 'receipt') {
    receipt.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'receipt')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'receipt')
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}

// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
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
