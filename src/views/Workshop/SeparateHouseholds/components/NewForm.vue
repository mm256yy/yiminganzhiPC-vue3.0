<template>
  <ElDialog
    title="分户信息"
    :model-value="props.show"
    :width="575"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div style="width: 100%; text-align: center; font-size: 18px">
      是否对<sapn style="font-weight: 900">{{ name }}</sapn
      >进行{{ isfh ? '分户' : '合户' }}
    </div>
    <ElForm
      class="policy-form"
      ref="formRef"
      label-position="right"
      :model="form"
      label-width="140px"
      :rules="rules"
    >
      <ElFormItem :label="isfh ? '分户原因：' : '合户原因：'" prop="reason" required>
        <ElSelect v-model="form.reason" class="!w-full">
          <ElOption
            v-for="item in dictObj[isfh ? 437 : 438]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="isfh ? '分户备注：' : '合户备注：'" prop="remark" required>
        <ElInput clearable type="textarea" :maxlength="20" v-model.trim="form.remark" />
      </ElFormItem>
      <ElFormItem :label="isfh ? '分户申请文件：' : '合户申请文件:'" prop="feedbackPic">
        <ElUpload
          :file-list="feedbackPic"
          :data="{
            type: 'image'
          }"
          accept=".dwg,.dws,.dxf,.png,.jpg,.jpeg,.pdf"
          class="upload-demo"
          action="/api/file/type"
          multiple
          :headers="{
            'Project-Id': appStore.getCurrentProjectId,
            Authorization: appStore.getToken
          }"
          :on-success="uploadFileChange1"
          :before-remove="beforeRemove"
          :on-remove="removeFile1"
          :on-preview="handlePreview"
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
<script lang="ts" setup>
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
  ElUpload,
  ElSelect,
  ElOption
} from 'element-plus'
import { ref, reactive, nextTick, watch, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { debounce } from 'lodash-es'

interface PropsType {
  show: boolean
  name: any
  isfh: any
}
const appStore = useAppStore()
interface FileItemType {
  name: string
  url: string
}
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
let formRef: any = ref('')
// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}
let form = reactive({ remark: '', reason: '', separateFile: '' })
let feedbackPic: any = ref([])
const { required } = useValidator()

const rules = reactive<FormRules>({
  remark: [required()],
  reason: [required()]
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
let handlePreview = (file) => {
  console.log(file)
  window.open(file.url)
}
// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      console.log(form)
      if (feedbackPic.value) {
        form.separateFile = JSON.stringify(feedbackPic.value)
      }
      emit('close')
      emit('submit', form)
    } else {
      return false
    }
  })
}, 600)
watch(
  () => props.show,
  () => {
    if (props.show) {
      console.log(dictObj)
    }
  },
  { deep: true }
)
</script>
