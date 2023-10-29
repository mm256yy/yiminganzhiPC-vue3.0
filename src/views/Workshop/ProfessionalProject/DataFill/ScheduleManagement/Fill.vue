<template>
  <ElDialog
    :title="title"
    :model-value="props.show"
    :width="600"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-label-required"> 完成时间： </div>
            <ElDatePicker
              :disabled="form.isComplete === '1'"
              v-model="form.completeDate"
              type="date"
              placeholder="请选择"
              class="!w-full"
            />
          </div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-label-required"> 照片： </div>
            <div class="card-img-list">
              <ElUpload
                action="/api/file/type"
                :disabled="form.isComplete === '1'"
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
                <template v-if="form.isComplete !== '1'" #trigger>
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

    <template v-if="form.isComplete !== '1'" #footer>
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
  ElDatePicker,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, nextTick, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { saveProfessionalScheduleApi } from '@/api/professional/service'

interface PropsType {
  show: boolean
  projectId: number
  professionalId: number
  row: any
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
const completePic = ref<FileItemType[]>([]) // 照片列表

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({})

const title = computed(() => {
  if (props.row.isComplete === '1') {
    return props.row.name + '查看'
  } else {
    return props.row.name + '填写'
  }
})

watch(
  () => props.show,
  () => {
    form.value = {
      ...props.row,
      projectId: props.projectId,
      professionalId: props.professionalId
    }

    if (form.value.completePic) {
      completePic.value = JSON.parse(form.value.completePic)
    }
  },
  // 可选 immediate: true 马上执行
  { deep: true, immediate: true }
)

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    completePic.value = []
  })
}

const submit = (data: any) => {
  saveProfessionalScheduleApi(data).then(() => {
    ElMessage.success('操作成功！')
    onClose(true)
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!form.value.completeDate) {
        ElMessage.error('请选择完成时间')
        return
      } else if (!completePic.value.length) {
        ElMessage.error('请上传相关凭证')
        return
      } else {
        let params: any = {
          ...form.value,
          isComplete: '1',
          completePic: JSON.stringify(completePic.value || []) // 相关凭证
        }
        submit(params)
      }
    } else {
      return false
    }
  })
})

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
</script>

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label-required {
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

.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
