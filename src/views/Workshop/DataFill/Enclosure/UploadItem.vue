<template>
  <div class="upload-wrap">
    <div class="upload-cont">
      <ElUpload
        action="/api/file/type"
        :data="{
          type: 'image'
        }"
        class="upload-trigger"
        accept=".jpg,.jpeg,.png"
        :multiple="true"
        :file-list="fileListData"
        :list-type="'picture'"
        :headers="headers"
        :on-success="uploadFileChange"
        :on-error="onError"
        :before-remove="() => false"
      >
        <template #file="{ file }">
          <div class="flex items-center w-full">
            <div class="img-box" @click="imgPreview(file)">
              <img :src="file.url" alt="" />
            </div>
            <div class="flex-1">
              <ElInput
                v-if="file.edit"
                v-model="file.name"
                clearable
                placeholder="修改附件名称"
                @blur="file.edit = false"
              />
              <div v-else class="flex items-center justify-between">
                <div class="w-234px" style="word-wrap: break-word">{{ file.name }}</div>
                <ElTooltip placement="top" content="修改附件名称">
                  <Icon
                    icon="uil:edit-alt"
                    color="var(--el-color-primary)"
                    @click="file.edit = true"
                  />
                </ElTooltip>
              </div>
            </div>
            <div class="upload-delete" @click="removeFile(file)">
              <Icon icon="ph:x" :size="14" />
            </div>
          </div>
        </template>
        <template #trigger>
          <div class="trigger">
            <ElButton :icon="addIcon" type="default">上传附件</ElButton>
          </div>
        </template>
      </ElUpload>
    </div>

    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ElUpload, ElDialog, ElInput, ElButton, ElTooltip, ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
// UploadFiles
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'

interface FileItemType {
  name: string
  url: string
}

interface PropsType {
  title: string
  fileList: FileItemType[]
}

const appStore = useAppStore()
const fileListData = ref<Array<FileItemType>>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const props = defineProps<PropsType>()
const emit = defineEmits(['change'])

watch(
  () => props.fileList,
  // () => {}
  (val) => {
    fileListData.value = val
  },
  { immediate: true, deep: true }
)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 处理函数
// const handleFileList = (fileList: UploadFiles) => {
//   let list: FileItemType[] = []
//   if (fileList && fileList.length) {
//     list = fileList
//       .filter((fileItem) => fileItem.status === 'success')
//       .map((fileItem) => {
//         return {
//           name: fileItem.name,
//           url: (fileItem.response as any)?.data || fileItem.url
//         }
//       })
//   }
//   fileListData.value=list
//   nextTick(() => {
//     emit('change', list)
//   })
// }

const handleFileList = (_file) => {
  fileListData.value.push({ name: _file.name, url: _file.response.data })

  nextTick(() => {
    emit('change', fileListData.value)
  })
}

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}

// 文件上传
// const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList)
// }
const uploadFileChange = (_response: any, _file: UploadFile) => {
  handleFileList(_file)
}

// 文件移除
const removeFile = (file: any) => {
  fileListData.value = fileListData.value.filter((item) => {
    if (file.response) {
      return item.url != file.response.data
    } else {
      return item.url != file.url
    }
  })

  emit('change', fileListData.value)
}

const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>

<style lang="less">
.upload-cont {
  .upload-trigger {
    display: flex;
    flex-wrap: wrap;
  }

  .el-upload-list.el-upload-list--picture {
    display: flex;
    width: 100%;
    margin: 0 !important;
    order: 1;
    flex-wrap: wrap;

    .el-upload-list__item {
      width: 358px;
      height: 90px;
      margin: 0 24px 16px 0;
      background: #ffffff;
      border: 1px solid #c3cbd9;
      border-radius: 4px;

      &:hover {
        .upload-delete {
          display: flex;
        }
      }
    }
  }

  .el-upload.el-upload--picture {
    order: 2;
  }

  .img-box {
    width: 70px;
    height: 70px;
    margin-right: 10px;
    overflow: hidden;
    cursor: pointer;
    background: #ffffff;
    border-radius: 4px;

    img {
      display: block;
      width: 100%;
    }
  }

  .upload-delete {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    width: 20px;
    height: 22px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }

  .trigger {
    display: flex;
    width: 358px;
    height: 90px;
    margin: 0 24px 16px 0;
    background: #ffffff;
    border: 1px solid #c3cbd9;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
  }
}
</style>
