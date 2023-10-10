<template>
  <!-- 协议签订-->
  <div class="table-wrap !py-12px !mt-0px">
    <div class="flex items-center justify-between pb-12px">
      <div> </div>
      <ElSpace>
        <ElButton
          class="!bg-[#30A952] !border-[#30A952]"
          type="primary"
          :icon="saveIcon"
          @click="onSave"
        >
          保存
        </ElButton>
      </ElSpace>
    </div>
    <div class="formBox">
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="120px"
        :label-position="'right'"
        :rules="rules"
      >
        <div class="titleBox">
          <span class="text">协议签订</span>
        </div>

        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="包干协议：">
              <div class="card-img-list">
                <ElUpload
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  :on-error="onError"
                  :list-type="'picture-card'"
                  accept=".jpg,.jpeg,.png,.pdf"
                  :multiple="true"
                  :file-list="lumpSumPic"
                  :headers="headers"
                  :on-success="uploadFileChange1"
                  :before-remove="beforeRemove"
                  :on-remove="removeFile1"
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

        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="其他附件：">
              <div class="card-img-list">
                <ElUpload
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  :on-error="onError"
                  :list-type="'picture-card'"
                  accept=".jpg,.jpeg,.png,.pdf"
                  :multiple="true"
                  :file-list="otherPic"
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
    </div>
  </div>
  <ElDialog title="查看图片" :width="920" v-model="dialogVisible">
    <img class="block w-full" :src="imgUrl" alt="Preview Image" />
  </ElDialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElButton,
  ElSpace,
  ElFormItem,
  ElForm,
  ElRow,
  ElCol,
  ElUpload,
  ElDialog
} from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { editProfessionalProjectApi } from '@/api/professional/service'

interface PropsType {
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const appStore = useAppStore()
const rules = ref()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const form = ref<any>({})
const lumpSumPic = ref<FileItemType[]>([]) // 包干协议照片
const otherPic = ref<FileItemType[]>([]) // 其他附件照片
const imgUrl = ref<string>('')
const dialogVisible = ref(false)

const emit = defineEmits(['updateData'])

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

watch(
  () => props.baseInfo,
  (val) => {
    // 处理表单数据
    form.value = {
      ...val
    }

    lumpSumPic.value = []
    otherPic.value = []

    try {
      if (form.value.lumpSumPic) {
        lumpSumPic.value = JSON.parse(form.value.lumpSumPic)
      }

      if (form.value.otherPic) {
        otherPic.value = JSON.parse(form.value.otherPic)
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

  if (type === 'lumpSum') {
    lumpSumPic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'lumpSum')
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'lumpSum')
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
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

// 保存
const onSave = () => {
  let params = {
    ...form.value,
    lumpSumPic: lumpSumPic.value ? JSON.stringify(lumpSumPic.value) : '',
    otherPic: otherPic.value ? JSON.stringify(otherPic.value) : ''
  }
  if (!lumpSumPic.value.length) {
    ElMessage.error('请上传包干协议')
    return
  }

  editProfessionalProjectApi(params as any).then(() => {
    ElMessage.success('操作成功！')
    emit('updateData')
  })
}
</script>
<style lang="less" scoped>
.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }

  .col-wrapper {
    display: flex;
    align-items: center;
    margin: 0 16px 16px 0;

    .col-label {
      display: inline-flex;
      width: 120px;
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
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
