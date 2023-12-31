<template>
  <ElDialog
    title="意见填写"
    :model-value="props.show"
    :width="575"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <ElForm
      class="policy-form"
      ref="formRef"
      label-position="right"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <ElFormItem label="户主：" prop="householder"> {{ props.householder }} </ElFormItem>
      <ElFormItem label="反馈阶段：" prop="type"> {{ getStateLabel(props.type) }} </ElFormItem>
      <ElFormItem label="问题描述：" prop="remark" required>
        <ElInput clearable type="textarea" :maxlength="20" v-model.trim="form.remark" />
      </ElFormItem>
      <ElFormItem label="附件：" prop="feedbackPic">
        <ElUpload
          :file-list="feedbackPic"
          :data="{
            type: 'image'
          }"
          accept=".dwg,.dws,.dxf,.png,.jpg,.jpeg"
          class="upload-demo"
          action="/api/file/type"
          multiple
          :headers="headers"
          :on-success="uploadFileChange1"
          :before-remove="beforeRemove"
          :on-remove="removeFile1"
        >
          <template #trigger>
            <el-button type="primary">点击上传</el-button>
          </template>
        </ElUpload>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
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
  ElMessageBox,
  ElUpload
} from 'element-plus'
import { ref, reactive, nextTick, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { saveFeedBackApi } from '@/api/workshop/feedback/service'
import { getStateLabel } from './config'

interface PropsType {
  show: boolean
  householder: string
  doorNo: string
  type: string
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()

const appStore = useAppStore()
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

/**
 * 反馈默认值
 */
const defaultValue = {
  projectId: appStore.getCurrentProjectId,
  householder: props.householder,
  doorNo: props.doorNo,
  type: props.type,
  feedbackPic: '[]',
  remark: '',
  status: '0'
}
const form = ref<any>(defaultValue)
const feedbackPic = ref<FileItemType[]>([])

// 规则校验
const rules = reactive<FormRules>({
  remark: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  console.log(data, 'data')
  saveFeedBackApi(data).then((res) => {
    if (res) {
      ElMessage.success('操作成功！')
      onClose(true)
    }
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      const data: any = {
        ...form.value
      }
      data.feedbackPic = JSON.stringify(feedbackPic.value)
      submit(data)
      console.log(data, '6666666')
    } else {
      return false
    }
  })
}, 600)

// 处理函数
const handleFileList = (fileList: UploadFiles) => {
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
  // CADfile.value
  console.log(list, 'list')
  feedbackPic.value = list
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}
watch(
  () => props.show,
  (val) => {
    if (val) {
      form.value = defaultValue
      feedbackPic.value = []
      form.value.type = props.type
    }
  }
)
</script>

<style lang="less">
.policy-form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}
</style>
