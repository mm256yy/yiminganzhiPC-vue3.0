<template>
  <ElDialog
    title="资金入账"
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
      <ElFormItem label="资金名称:" prop="name" required>
        <ElInput type="text" v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="资金来源:" prop="source" required>
        <ElSelect class="w-350px" v-model="form.source">
          <ElOption
            v-for="item in dictObj[388]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="金额(元):" prop="amount" required>
        <ElInputNumber v-model="form.amount" />
      </ElFormItem>
      <ElFormItem label="入账时间:" prop="recordTime" required>
        <ElDatePicker type="date" v-model="form.recordTime" />
      </ElFormItem>
      <ElFormItem label="说明:">
        <ElInput type="text" v-model="form.remark" />
      </ElFormItem>
      <ElFormItem label="凭证编号:" prop="receiptPic" required>
        <ElInput type="text" v-model="form.receiptPic" />
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
      <!-- <ElButton type="primary" @click="onSubmit(formRef, 0)">保存草稿</ElButton> -->
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
import { addLegalFundEntryApi, updateFundEntryApiLegal } from '@/api/fundManage/fundEntry-service'
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
  receiptPic: [required()],
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
  let receiptPic = data.receipt
  let receipt = data.receiptPic
  data = {
    ...data,
    receiptPic,
    receipt
  }
  if (props.actionType === 'add') {
    data.projectId = appStore.getCurrentProjectId
    // data.entryType = '1' // 1普通入账 2法人入账

    await addLegalFundEntryApi(data)
  } else {
    await updateFundEntryApiLegal(data)
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl, status: number) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      if (!receipt.value.length) {
        ElMessage.error('请上传凭证')
        return
      }
      let params: any = {
        ...form.value,
        receipt: JSON.stringify(receipt.value || []) // 搬迁安置确认单
      }
      params.recordTime = dayjs(params.recordTime)
      params.status = status
      submit(params)
    } else {
      console.log('error submit!', fields)
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
    console.log('MM-P', receipt.value)
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
