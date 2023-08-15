<template>
  <ElDialog
    title="档案上传"
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
      <ElRow>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-label-required"> 房屋评估报告： </div>
            <div class="card-img-list">
              <ElUpload
                :list-type="'picture-card'"
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="false"
                :file-list="houseEstimatePic"
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
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-label-required"> 土地评估报告： </div>
            <div class="card-img-list">
              <ElUpload
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                :on-error="onError"
                :list-type="'picture-card'"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="true"
                :file-list="landEstimatePic"
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
          </div>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
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
  ElButton,
  FormInstance,
  FormRules,
  ElUpload,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, nextTick, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { getDocumentationApi, saveDocumentationApi } from '@/api/AssetEvaluation/service'

interface PropsType {
  show: boolean
  doorNo: string
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const houseEstimatePic = ref<FileItemType[]>([]) // 房屋评估报告文件列表
const landEstimatePic = ref<FileItemType[]>([]) // 土地评估报告列表

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({})

const initData = () => {
  getDocumentationApi(props.doorNo).then((res: any) => {
    if (res) {
      form.value = { ...res }
      if (form.value.houseEstimatePic) {
        houseEstimatePic.value = JSON.parse(form.value.houseEstimatePic)
      }

      if (form.value.landEstimatePic) {
        landEstimatePic.value = JSON.parse(form.value.landEstimatePic)
      }
    }
  })
}

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any) => {
  saveDocumentationApi(data).then(() => {
    ElMessage.success('操作成功！')
  })
  onClose()
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!houseEstimatePic.value.length) {
        ElMessage.error('请上传房屋评估报告')
        return
      } else if (!landEstimatePic.value.length) {
        ElMessage.error('请上传土地评估报告')
        return
      } else {
        let params: any = {
          ...form.value,
          doorNo: props.doorNo,
          houseEstimatePic: JSON.stringify(houseEstimatePic.value || []), // 房屋评估报告
          landEstimatePic: JSON.stringify(landEstimatePic.value || []) // 土地评估报告
        }
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

  if (type === 'houseEstimate') {
    houseEstimatePic.value = list
  } else if (type === 'landEstimate') {
    landEstimatePic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'houseEstimate')
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'landEstimate')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'houseEstimate')
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'landEstimate')
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

onMounted(() => {
  initData()
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
