<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '上传报告' : ''"
    :model-value="props.show"
    :width="609"
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
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="项目类型" prop="projectType">
        <ElSelect class="w-350px" v-model="form.projectType">
          <ElOption
            v-for="item in projectTypeDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="文件名称" prop="name">
        <ElInput v-model="form.name" class="!w-350px" placeholder="请输入文件名称" />
      </ElFormItem>

      <ElFormItem label="类型" prop="fileType">
        <ElSelect class="w-350px" v-model="form.fileType">
          <ElOption
            v-for="item in dictObj[357]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="描述" prop="content">
        <ElInput type="textarea" v-model="form.content" />
      </ElFormItem>

      <ElFormItem label="报告文件">
        <ElUpload
          action="/api/file/type"
          :data="{
            type: 'reportFiles'
          }"
          :on-error="onError"
          :disabled="actionType === 'view'"
          :list-type="'text'"
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.gif,.png,.jpg"
          :multiple="true"
          :file-list="fileUrl"
          :limit="1"
          :headers="headers"
          :on-success="uploadFileChange"
          :before-remove="beforeRemove"
          :on-remove="removeFile"
          :on-preview="imgPreview"
        >
          <div class="tips-wrapper">
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip">
              只支持doc、docx、xls、xlsx、ppt、pptx、pdf、txt、gif、png、jpg格式
            </div>
          </div>
        </ElUpload>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)" :loading="btnLoading">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch, computed } from 'vue'
import type { UploadFile, UploadFiles } from 'element-plus'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElUpload,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { debounce } from 'lodash-es'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useValidator } from '@/hooks/web/useValidator'
import { ReportUpdateType } from '@/api/workshop/report/types'
import { addReportApi, updateReportApi } from '@/api/workshop/report/service'

interface PropsType {
  show: boolean
  actionType: string
  reportType: string
  row?: ReportUpdateType | null | undefined
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { required } = useValidator()

const defaultValue: Omit<ReportUpdateType, 'id'> = {}
const form = ref<Omit<ReportUpdateType, 'id'>>(defaultValue)
const formRef = ref<FormInstance>()
const projectTypeDict =
  props.reportType === 'ProfessionalProject' ? dictObj.value[358] : dictObj.value[356]

const fileUrl = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const headers = {
  'Project-Id': projectId,
  Authorization: appStore.getToken
}

const emit = defineEmits(['close'])

watch(
  () => props.show,
  () => {
    // 处理表单数据
    form.value = {
      ...props.row
    }
    try {
      if (form.value.fileUrl) {
        fileUrl.value = JSON.parse(form.value.fileUrl)
      }
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 文件上传
const uploadFileChange = (_response: any, _file: any) => {
  // console.log('fileList:', fileList)
  fileUrl.value.push({ name: _file.name, url: _file.response.data })
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

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
  fileUrl.value = list
}

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的文件或者重新上传')
}

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  source: [required()],
  amount: [required()],
  recordTime: [required()]
})

// 提交表单 - 表单校验
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      submit({ ...form.value })
    }
  })
})

// 表单提交
const submit = async (data: any) => {
  const { actionType, reportType } = props
  const params = {
    ...data,
    projectId,
    type: reportType
  }
  if (actionType === 'add') {
    await addReportApi({ ...params })
  } else {
    await updateReportApi({ ...params })
  }
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}
</script>

<style lang="less" scoped>
.el-upload__tip {
  font-size: 12px;
  line-height: 1.5;
  flex: 1 auto;
}

:deep(.el-textarea) {
  width: 350px !important;
}
</style>
