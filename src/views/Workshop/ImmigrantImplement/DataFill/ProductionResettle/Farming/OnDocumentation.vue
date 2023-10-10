<template>
  <ElDialog
    title="档案上传"
    :model-value="props.show"
    :width="1200"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="200px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="农业安置凭证：" required>
            <div class="card-img-list">
              <ElUpload
                :list-type="'picture-card'"
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                accept=".jpg,.jpeg,.png,.pdf,.word"
                :multiple="true"
                :file-list="agriculturePic"
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
                accept=".jpg,.jpeg,.png,.pdf,.word"
                :on-error="onError"
                :list-type="'picture-card'"
                :multiple="true"
                :file-list="agricultureOtherPic"
                :headers="headers"
                :on-success="uploadFileChange3"
                :before-remove="beforeRemove"
                :on-remove="removeFile3"
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
  ElFormItem,
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
import { getDocumentationApi, saveDocumentationApi } from '@/api/immigrantImplement/common-service'

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
const agriculturePic = ref<FileItemType[]>([])
const agricultureOtherPic = ref<FileItemType[]>([])

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({})

const initData = () => {
  getDocumentationApi(props.doorNo).then((res: any) => {
    form.value = { ...res }
    if (form.value.agriculturePic) {
      agriculturePic.value = JSON.parse(form.value.agriculturePic)
    }

    if (form.value.agricultureOtherPic) {
      agricultureOtherPic.value = JSON.parse(form.value.agricultureOtherPic)
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
      if (!agriculturePic.value.length) {
        ElMessage.error('请上传农业安置凭证')
        return
      } else {
        let params: any = {
          ...form.value,
          agriculturePic: JSON.stringify(agriculturePic.value || []), // 交房协议
          agricultureOtherPic: JSON.stringify(agricultureOtherPic.value || []) // 其他附件
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

  if (type === 'agriculturePic') {
    agriculturePic.value = list
  } else if (type === 'agricultureOtherPic') {
    agricultureOtherPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'agriculturePic')
}

const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'agricultureOtherPic')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'agriculturePic')
}

const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'agricultureOtherPic')
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
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
