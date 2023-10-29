<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto group_deliver">
      <div class="flex-col section_deliver">
        <div class="flex-col section">
          <span class="self-start label-txt">标题</span>
          <div class="divider view"></div>
          <ElInput v-model="form.title" type="textarea" placeholder="请输入" :rows="3" />
        </div>
        <div class="flex-col section">
          <span class="self-start label-txt">内容</span>
          <div class="divider view"></div>
          <ElInput v-model="form.content" type="textarea" placeholder="请输入" :rows="4" />
        </div>
        <div class="flex-col section">
          <span class="self-start label-txt">封面图</span>
          <div class="divider view"></div>
          <span class="self-start warn-txt">图片最多可上传3张</span>
          <ElUpload
            action="/api/h5/file/type"
            :data="{
              type: 'archives'
            }"
            :on-error="onError"
            accept=".jpg,.jpeg,.png,.pdf"
            :multiple="true"
            :file-list="attachPicList"
            :headers="headers"
            :on-success="uploadFileChange"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
            :on-preview="imgPreview"
            list-type="picture-card"
            :limit="3"
          >
            <template #trigger>
              <div class="upload-img-custom">
                <ElImage :src="addImageSrc" alt="添加图片" />
              </div>
            </template>
          </ElUpload>
        </div>
      </div>
    </div>
    <!-- <el-dialog v-model="dialogVisible">
      <img class="w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog> -->
  </div>
  <div class="operate-region">
    <div class="quit" @click="onQuit">放弃</div>
    <div class="deliver" @click="onDeliver">投稿</div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
// import { useAppStore } from '@/store/modules/app'
import { ElMessage, ElMessageBox, ElUpload, ElImage, ElInput } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import addImageSrc from '@/h5/assets/imgs/icon_add.png'
// import type { DeliverDtoType } from './type'
import { addHomesicknessApi } from './service'
import { useRouter } from 'vue-router'
interface FileItemType {
  name: string
  url: string
}
const { back } = useRouter()
// const appStore = useAppStore()
// const projectId = appStore.currentProjectId
const dialogVisible = ref<boolean>(false)
const imgUrl = ref<string>('')
// const title = ref<string>('')
const form = ref<any>({
  title: '',
  content: ''
})
const attachPicList = ref<FileItemType[]>([]) // 照片文件列表

const headers = {
  'Project-Id': '',
  Authorization:
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqbHNzIiwiVUlEIjoiMTM4IiwiYXV0aCI6Ik5PUk1BTF9VU0VSIiwiZXhwIjoxNjk4MjEyNDczfQ.g1NEs0A6I1_H-KRbol8xpuHX8ZDVqDjDAjwXwkQQxijSRKoksAE1ZRD_N0QZsH0pZXBysmoq538dVjAUwHJEqw'
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

  attachPicList.value = list
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
let addHomesicknessApis = async (e) => {
  let data = await addHomesicknessApi(e)
  console.log(data)
  back()
}
// 投稿
const onDeliver = () => {
  console.log(form, attachPicList.value)
  if (!form.value.title) {
    ElMessage.error('请填写标题')
  } else if (!form.value.content) {
    ElMessage.error('请填写内容')
  } else if (attachPicList.value.length == 0) {
    ElMessage.error('请上传图片')
  } else {
    addHomesicknessApis({ ...form.value, coverPic: JSON.stringify(attachPicList.value) })
  }

  // const params = {
  //   ...data,
  //   projectId,
  //   coverPic: JSON.stringify(attachPicList.value)
  // }
  // if (actionType === 'add') {
  //   await addReportApi({ ...params })
  // } else {
  //   await updateReportApi({ ...params })
  // }
  // btnLoading.value = false
  // ElMessage.success('操作成功！')
  // onClose(true)
}

// 放弃
const onQuit = () => {
  console.log('onQuit')
  for (let i in form.value) {
    delete form.value[i]
  }
  back()
}
</script>

<style lang="less" scoped>
.group_deliver {
  padding-top: 30px;
  overflow-y: auto;

  .section_deliver {
    padding: 0 30px;

    .section {
      padding: 40px 32px 32px;
      margin: 12px 0;
      background-color: #ffffff;
      border-radius: 16px;

      .label-txt {
        font-family: PingFang SC;
        font-size: 32px;
        line-height: 30px;
        color: #171718;
      }

      .divider {
        height: 2px;
        background-color: #f2f3f5;
      }

      .title-txt {
        font-size: 32px;
        line-height: 42px;
        color: #131313;
      }

      .view {
        margin: 28px 0;
      }

      .warn-txt {
        font-size: 26px;
        line-height: 26px;
        color: #13131366;
      }
    }
  }
}

.operate-region {
  position: fixed;
  right: 0;
  bottom: 0px;
  left: 0;
  display: flex;
  height: 128px;
  margin-top: 16px;
  background: #ffffff;
  border-top: 1px solid #eee;
  align-items: center;

  .quit {
    width: 176px;
    height: 96px;
    margin: 0 0 0 22px;
    font-size: 32px;
    font-weight: bold;
    line-height: 96px;
    color: #3e73ec;
    text-align: center;
    background: #f2f6ff;
    border-radius: 16px;
  }

  .deliver {
    height: 96px;
    margin: 0 24px;
    font-size: 32px;
    font-weight: bold;
    line-height: 96px;
    color: #ffffff;
    text-align: center;
    background: linear-gradient(90deg, #3e73ec 0%, #3ea3ec 100%);
    border-radius: 16px;
    flex: 1 auto;
  }
}

.upload-img-custom {
  width: 128px;
  height: 128px;
  padding: 30px;
  margin-top: 20px;
}

:deep(.el-upload--picture-card) {
  width: 128px;
  height: 128px;
  margin-top: 20px;
}
</style>
