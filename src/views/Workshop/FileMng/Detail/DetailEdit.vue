<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : '新增'"
    :model-value="props.show"
    :width="580"
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
      <ElFormItem label="题名" prop="fileTitle">
        <ElInput v-model="form.fileTitle" class="!w-350px" placeholder="请输入题名" />
      </ElFormItem>
      <ElFormItem label="文件档号" prop="archiveNo">
        <ElInput class="!w-350px" v-model="form.archiveNo" placeholder="请输入文件档号">
          <template #prepend>{{ dictObj[417][0]?.label }}</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="存放位置" prop="depositLocation">
        <ElInput v-model="form.depositLocation" class="!w-350px" placeholder="请输入存放位置" />
      </ElFormItem>
      <ElFormItem label="保管期限" prop="keepTerm">
        <ElSelect class="w-350px" v-model="form.keepTerm">
          <ElOption
            v-for="item in periodDicts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="文件页数" prop="filePage">
        <ElInputNumber placeholder="文件页数" v-model="form.filePage" :controls="true" />
      </ElFormItem>
      <ElFormItem label="页码范围" prop="pageLow">
        <ElInputNumber placeholder="开始页码" v-model="form.pageTop" :controls="true" />
        &nbsp;&nbsp;至&nbsp;&nbsp;
        <ElInputNumber placeholder="结束页码" v-model="form.pageLow" :controls="true" />
      </ElFormItem>
      <ElFormItem label="责任人" prop="dutyPerson">
        <ElInput class="!w-350px" placeholder="请输入责任人" v-model="form.dutyPerson" />
      </ElFormItem>
      <ElFormItem label="形成时间" prop="formDate">
        <ElDatePicker
          class="!w-350px"
          v-model="form.formDate"
          type="date"
          placeholder="请选择日期"
        />
      </ElFormItem>
      <ElFormItem label="上传档案" required>
        <ElUpload
          action="/api/file/type"
          :data="{
            type: 'reportFiles'
          }"
          :on-error="onError"
          :disabled="actionType === 'view'"
          :list-type="'text'"
          accept=".pdf"
          :multiple="true"
          :file-list="fileUrl"
          :limit="1"
          :headers="headers"
          :on-success="uploadFileChange"
          :before-remove="beforeRemove"
          :on-remove="removeFile"
          :on-preview="filePreview"
        >
          <div class="tips-wrapper">
            <ElButton size="small" type="primary">点击上传</ElButton>
            <div v-if="fileUrl?.length === 0" class="el-upload__tip text-red"> 只支持pdf格式 </div>
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
  ElMessage,
  ElInputNumber,
  ElDatePicker
} from 'element-plus'
import { debounce } from 'lodash-es'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useValidator } from '@/hooks/web/useValidator'
import type { DetailUpdateType } from '@/api/fileMng/types'
import { addFileInfo, updateFileInfo } from '@/api/fileMng/service'

interface PropsType {
  show: boolean
  actionType: string
  pId: string // 父级Id
  pType: string // 父级类型
  showDoorNo: string
  name: string
  row?: DetailUpdateType | null | undefined
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { required } = useValidator()
const defaultValue: Omit<DetailUpdateType, 'id'> = {}
const form = ref<Omit<DetailUpdateType, 'id'>>(defaultValue)
const formRef = ref<FormInstance>()
const fileUrl = ref<FileItemType[]>([])
const btnLoading = ref<boolean>(false)
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const periodDicts = [
  {
    label: '永久',
    value: '永久'
  },
  {
    label: '30年',
    value: '30年'
  }
]

const headers = {
  'Project-Id': projectId,
  Authorization: appStore.getToken
}

const emit = defineEmits(['close'])

watch(
  () => props.show,
  (val) => {
    // 处理表单数据
    if (val) {
      if (props.actionType !== 'add') {
        form.value = {
          ...props.row
        }

        try {
          if (form.value.personPic) {
            fileUrl.value = JSON.parse(form.value.personPic)
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        form.value = {
          ...defaultValue
        }
        fileUrl.value = []
      }
    }
  }
)

// 文件上传
const uploadFileChange = (_response: any, _file: any) => {
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

// 文件预览
const filePreview = (uploadFile: UploadFile) => {
  if (uploadFile.url) {
    window.open(uploadFile.url)
  }
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
  fileTitle: [required()],
  archiveNo: [required()]
})

// 提交表单 - 表单校验
const onSubmit = debounce((formEl) => {
  // 先判断档案是否上传
  if (fileUrl.value?.length <= 0) {
    ElMessage.error('请先上传档案！')
    return
  }
  formEl?.validate((valid: any) => {
    if (valid) {
      submit({ ...form.value })
    }
  })
})

// 表单提交
const submit = async (data: any) => {
  const { actionType, pId, pType, showDoorNo, name } = props
  const params = {
    ...data,
    pId,
    pType,
    showDoorNo,
    name,
    personPic: JSON.stringify(fileUrl.value),
    projectId
  }
  if (actionType === 'add') {
    await addFileInfo({ ...params })
  } else {
    await updateFileInfo({ ...params })
  }
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  form.value = {
    ...defaultValue,
    fileUrl: []
  }
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

.text-red {
  color: #f87575;
}

:deep(.el-textarea) {
  width: 350px !important;
}
</style>
