<template>
  <Dialog
    :model-value="props.show"
    title="发布新版"
    :fullscreen="false"
    style="width: 500px"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="false">
      <template #aaa>
        <ElUpload
          class="w-full apk-upload"
          drag
          :multiple="false"
          action="/api/file/type"
          :data="{
            type: 'apk'
          }"
          accept=".apk"
          :file-list="apkUrlList"
          :headers="headers"
          :limit="1"
          :on-success="uploadFileChange"
          :before-remove="beforeRemove"
          :on-remove="removeFile"
        >
          <div class="el-upload__text"> 拖入文件或者 <em>点击上传</em> 只支持apk文件 </div>
        </ElUpload>
      </template>
    </Form>
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, unref, ref, onMounted } from 'vue'
import { ElButton, ElMessageBox, ElUpload } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { AppVersionDtoType } from '@/api/appVersion/types'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'

interface Props {
  actionType: string
  show: boolean
  row: AppVersionDtoType | null
}

const appStore = useAppStore()
const props = defineProps<Props>()
const emit = defineEmits(['close', 'submit'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = ref(props.row)
// const projectId = ref(props.projectId)

const headers = ref({
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
})
const apkUrlList = ref<any[]>([])

console.log(headers)

const { register, elFormRef, methods } = useForm()

const rules = {
  appId: [required()],
  title: [required()],
  content: [required()],
  version: [required()],
  apkUrl: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'appId',
    label: '应用ID',
    component: 'Select',
    value: '__UNI__7FD06C8',
    componentProps: {
      placeholder: '选择发布平台',
      options: [
        {
          label: '移民调查',
          value: '__UNI__7FD06C8'
        }
      ]
    }
  },
  {
    field: 'title',
    label: '更新标题',
    component: 'Input'
  },
  {
    field: 'content',
    label: '更新日志',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3
    }
  },
  {
    field: 'apkUrl',
    // label: '上传APK',
    label: 'APK链接地址',
    component: 'Input'
  },
  {
    field: 'version',
    label: '版本',
    component: 'InputNumber',
    value: 1,
    componentProps: {
      step: 0.1
    }
  },
  {
    field: 'platform',
    label: '平台',
    component: 'Select',

    value: 'android',
    componentProps: {
      placeholder: '选择发布平台',
      options: [
        {
          label: '安卓',
          value: 'android'
        }
      ]
    }
  },
  {
    field: 'publish',
    label: '上线发行',
    component: 'Switch',
    value: false
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 1
    }
  }
])

onMounted(async () => {
  methods.setValues(currentRow.value as AppVersionDtoType)
  if (currentRow.value?.apkUrl) {
    apkUrlList.value = [
      {
        name: currentRow.value?.apkUrl,
        url: currentRow.value?.apkUrl
      }
    ]
  }
})

const onSave = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      // if (!apkUrlList.value || !apkUrlList.value.length) {
      //   ElMessage.error('apk文件缺失')
      //   return
      // }
      doSave()
    }
  })
}

const doSave = async () => {
  loading.value = true
  const data = (await methods.getFormData()) || {}
  // 修改
  if (currentRow.value && currentRow.value.id) {
    data.id = currentRow.value.id
  }
  // data.apkUrl = apkUrlList.value && apkUrlList.value.length ? apkUrlList.value[0].url : ''
  emit('submit', data)
}

const onClose = () => {
  emit('close')
}

// 处理已上传的文件
const handleFileList = (fileList: UploadFiles) => {
  console.log('fileList:', fileList)
  if (fileList && fileList.length) {
    const list = fileList
      .filter((fileItem: any) => fileItem.status === 'success')
      .map((fileItem: any) => {
        return {
          name: fileItem.name,
          url: fileItem.url || (fileItem.response.data as string)
        }
      })
    apkUrlList.value = list
  }
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 移除之前
const beforeRemove = () => {
  return ElMessageBox.confirm(`确认移除文件吗?`).then(
    () => true,
    () => false
  )
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}
</script>

<style lang="less">
.apk-upload {
  .el-upload-dragger {
    padding: 20px 10px;
  }
}
</style>
