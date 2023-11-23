<template>
  <ContentWrap title="文章详情">
    <Form @register="register" :schema="schema" :rules="rules">
      <template #coverPic>
        <span style="position: absolute; top: 0; left: -78px; color: red">*</span>

        <ElUpload
          action="/api/file/type"
          :data="{
            type: 'image'
          }"
          :limit="1"
          accept=".jpg,.jpeg,.png"
          :multiple="false"
          :file-list="coverPic"
          :headers="headers"
          :on-success="uploadFileChangeCoverPic"
          :before-remove="beforeRemove"
          :on-remove="removeFileCoverPic"
          :on-preview="imgPreview"
        >
          <template #trigger>
            <ElButton :icon="uploadIcon" type="primary">封面上传</ElButton>
          </template>
        </ElUpload>
      </template>
      <template #enclosure>
        <ElUpload
          action="/api/file"
          multiple
          :limit="2"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.zip,.GIF,.BMP,.PDF,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rar"
          :file-list="enclosure"
          :headers="headers"
          :on-success="uploadFileChange"
          :before-remove="beforeRemove"
          :on-remove="removeFile"
          :on-preview="filePreview"
        >
          <template #trigger>
            <ElButton :icon="uploadIcon" type="primary">附件上传</ElButton>
          </template>
        </ElUpload>
      </template>
    </Form>
    <ElSpace>
      <ElButton type="primary" @click="onSave">保存</ElButton>
      <ElButton @click="backToList">返回</ElButton>
    </ElSpace>

    <el-dialog v-model="dialogVisible">
      <img class="w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
  </ContentWrap>
</template>

<script setup lang="ts">
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { reactive, unref, ref, onMounted } from 'vue'
import { ElMessage, ElUpload, ElButton, ElMessageBox, ElSpace, ElDialog } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { IEditorConfig } from '@wangeditor/editor'
import { useAppStore } from '@/store/modules/app'
import { addNewsApi, updateNewsApi, getNewsByIdApi } from '@/api/project/news/service'
import { useRouter } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { listDictDetailApi } from '@/api/sys/index'
import { NewsDtoType } from '@/api/project/news/types'

type InsertFnType = (url: string, alt: string, href: string) => void
type InsertFnVideoType = (url: string, poster?: string) => void
interface FileItemType {
  name: string
  url: string
}

const { currentRoute, back } = useRouter()
const uploadIcon = useIcon({ icon: 'ant-design:cloud-upload-outlined' })
const { query } = unref(currentRoute)
const appStore = useAppStore()
const { required } = useValidator()
const { register, elFormRef, methods } = useForm()
const newsTypes = ref<any[]>([])
const id: number = query.id ? +query.id : 0

const coverPic = ref<FileItemType[]>([])
const enclosure = ref<FileItemType[]>([])
const dialogVisible = ref<boolean>(false)
const imgUrl = ref<string>('')

enum BucketType {
  IMAGE = 'image',
  VIDEO = 'video',
  EXCEL = 'excel'
}

const dictName = 'news' // 字典名称

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage: {
      server: '/api/file/type',
      fieldName: 'file',
      meta: {
        type: BucketType.IMAGE
      },
      headers,
      customInsert(res: any, insertFn: InsertFnType) {
        if (res && res.data) {
          insertFn(res.data, 'image', '#')
        }
      }
    },
    uploadVideo: {
      server: '/api/file/type',
      fieldName: 'file',
      meta: {
        type: BucketType.VIDEO
      },
      headers,
      customInsert(res: any, insertFn: InsertFnVideoType) {
        if (res && res.data) {
          insertFn(res.data)
        }
      }
    }
  }
}

const getNewsDict = async () => {
  const res = await listDictDetailApi({
    name: dictName,
    projectId: appStore.getCurrentProjectId
  })
  if (res && res.dictValList) {
    newsTypes.value = res.dictValList
  }
}

getNewsDict()

onMounted(() => {
  if (!id) {
    return
  }
  getNewsByIdApi(id).then((res) => {
    if (res) {
      coverPic.value = JSON.parse(res.coverPic)
      enclosure.value = JSON.parse(res.enclosure)

      methods.setValues({
        ...res,
        coverPic: coverPic.value,
        enclosure: enclosure.value
      })
    }
  })
})

const schema = reactive<FormSchema[]>([
  {
    field: 'type',
    label: '文章类型',
    component: 'Select',
    componentProps: {
      options: newsTypes as any
    }
  },
  {
    field: 'author',
    label: '创建人',
    component: 'Input'
  },
  {
    field: 'title',
    label: '文章标题',
    component: 'Input'
  },
  {
    field: 'coverPic',
    label: '文章封面'
  },
  {
    field: 'content',
    label: '文章内容',
    component: 'Editor',
    componentProps: {
      editorConfig,
      style: {
        zIndex: 1000
      }
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'enclosure',
    label: '附件上传'
  },
  {
    field: 'releaseTime',
    label: '发布时间',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    field: 'hasTop',
    label: '是否置顶',
    component: 'Switch',
    value: false
  },
  {
    field: 'hasShow',
    label: '是否展示',
    component: 'Switch',
    value: true
  }
])

const rules = {
  title: [required()],
  type: [required()],
  author: [required()],
  content: [required()],
  releaseTime: [required()]
}

const onSave = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      if (!coverPic.value || !coverPic.value.length) {
        return ElMessage.error('封面必传')
      }
      onSubmit()
    }
  })
}

const onSubmit = async () => {
  const data: NewsDtoType = (await methods.getFormData()) || {}
  data.coverPic = JSON.stringify(coverPic.value)
  data.enclosure = JSON.stringify(enclosure.value)
  if (!id) {
    await addNewsApi({
      ...data
    })
  } else {
    await updateNewsApi({
      ...data,
      id
    })
  }
  ElMessage.success('操作成功！')
  back()
}

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
  if (type === 'enclosure') {
    enclosure.value = list
  } else {
    coverPic.value = list
  }
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'enclosure')
}

const uploadFileChangeCoverPic = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'coverPic')
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
  handleFileList(fileList, 'enclosure')
}

const removeFileCoverPic = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'coverPic')
}

const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const filePreview = (uploadFile: UploadFile) => {
  if (uploadFile.url) {
    window.open(uploadFile.url)
  }
}

const backToList = () => {
  back()
}
</script>

<style lang="less" scoped></style>
