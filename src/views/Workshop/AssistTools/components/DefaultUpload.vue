<template>
  <ElDialog
    title="档案上传"
    :model-value="props.show"
    :width="1000"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm class="form" ref="formRef" :model="form" label-width="110px" :label-position="'right'">
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="其他附件：">
            <div class="card-img-list">
              <ElUpload
                ref="otherRef"
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                :on-error="onError"
                :list-type="'picture-card'"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="true"
                :file-list="graveChooseOtherPic"
                :headers="headers"
                :on-success="uploadFileChange2"
                :before-remove="beforeRemove"
                :on-remove="removeFile2"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="card-img-box">
                    <div class="card-img-custom">
                      <Icon icon="ant-design:plus-outlined" :size="22" />
                    </div>
                    <div class="card-txt">点击上传</div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton :loading="btnLoading" type="primary" @click="onSubmit(formRef)">确认</ElButton>
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
  ElUpload,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, nextTick, watch } from 'vue'
import type { UploadFile, UploadFiles } from 'element-plus'

import { useAppStore } from '@/store/modules/app'
import { saveOtherAttachUploadApi } from '@/api/immigrantImplement/common-service'
import type { GraveType } from '@/api/immigrantImplement/siteConfirmation/tombSiteSel-types'
import { getImmigrantLandApi } from '@/api/immigrantImplement/siteConfirmation/common-service'

interface PropsType {
  show: boolean
  doorNo: any
  id: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const otherRef = ref()

const defaultValue: Omit<GraveType, 'id'> = {
  graveChooseOtherPic: '' // 其他附件
}
const form = ref<Omit<GraveType, 'id'>>(defaultValue)
const graveChooseOtherPic = ref<FileItemType[]>([])

const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const btnLoading = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

const initData = () => {
  if (!props.id) {
    return
  }
  getImmigrantLandApi(props.id).then((res: any) => {
    form.value = res
    if (form.value.produceVerifyPic) {
      graveChooseOtherPic.value = JSON.parse(form.value.produceVerifyPic)
    }
  })
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    otherRef.value.clearFiles()
  })
}

const submit = async (data: any) => {
  btnLoading.value = true
  try {
    await saveOtherAttachUploadApi({
      ...data
    })
    btnLoading.value = false
  } catch {
    btnLoading.value = false
  }

  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = () => {
  if (!graveChooseOtherPic.value || graveChooseOtherPic.value?.length <= 0) {
    ElMessage.error('请上传文档')
    return
  }
  const data: any = {
    ...form.value,
    produceVerifyPic: JSON.stringify(graveChooseOtherPic.value || [])
  }
  submit(data)
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
  graveChooseOtherPic.value = list
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
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

watch(
  () => props.show,
  () => {
    initData()
  }
)
</script>

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label {
    display: inline-flex;
    width: 110px;
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
