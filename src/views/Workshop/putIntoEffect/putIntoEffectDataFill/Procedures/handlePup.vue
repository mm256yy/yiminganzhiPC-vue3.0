<template>
  <ElDialog
    title="办理"
    :model-value="props.show"
    :width="700"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="130px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="完成时间：" required>
            <ElDatePicker
              v-model="form.completeDate"
              type="date"
              placeholder="请选择"
              class="!w-full"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="相关凭证：" required>
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
                :file-list="completePic"
                :headers="headers"
                :on-success="uploadFileChange"
                :before-remove="beforeRemove"
                :on-remove="removeFile"
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
      <ElButton type="primary" :loading="loading" @click="onSubmit(formRef)">确认</ElButton>
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
  ElUpload,
  FormInstance,
  FormRules,
  ElDatePicker,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { saveProceduresApi } from '@/api/putIntoEffect/procedures'
import dayjs from 'dayjs'

interface PropsType {
  show: boolean
  row?: any
  doorNo: string
}

interface FileItemType {
  name: string
  url: string
}
const appStore = useAppStore()

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()

const form = ref<any>()
const imgUrl = ref<string>('')
const completePic = ref<FileItemType[]>([])
const loading = ref(false)
const dialogVisible = ref(false)

watch(
  () => props.show,
  () => {
    form.value = { ...props.row }

    if (form.value.completePic) {
      completePic.value = JSON.parse(form.value.completePic)
    }
  },
  // 可选 immediate: true 马上执行
  { deep: true, immediate: true }
)

// 规则校验
const rules = reactive<FormRules>({
  completeDate: [{ required: true, message: '请选择', trigger: 'blur' }],
  completePic: [{ required: true }]
})

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
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

  completePic.value = list
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
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

const submit = async (data: any) => {
  await saveProceduresApi({
    doorNo: props.doorNo, // 户号
    type: data.type, // 字典373
    completeDate: data.completeDate ? dayjs(data.completeDate) : '',
    completePic: data.completePic,
    needHandle: '1',
    isComplete: '1'
  })
    .then(() => {
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
  ElMessage.success('操作成功！')
  onClose()
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!form.value.completeDate) {
        ElMessage.error('请选择完成时间')
        return
      } else if (!completePic.value.length) {
        ElMessage.error('请上传凭证')
        return
      } else {
        const data: any = {
          ...form.value,
          completePic: JSON.stringify(completePic.value || [])
        }
        loading.value = true
        submit(data)
      }
    } else {
      return false
    }
  })
}, 600)
</script>

<style lang="less">
.sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #313131;
}

.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label-required {
    display: inline-flex;
    width: 130px;
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
