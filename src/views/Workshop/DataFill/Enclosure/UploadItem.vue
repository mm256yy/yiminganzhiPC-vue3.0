<template>
  <div class="upload-wrap">
    <div class="upload-cont">
      <ElUpload
        action="/api/file/type"
        :data="{
          type: 'image'
        }"
        class="upload-trigger"
        accept=".jpg,.jpeg,.png,.svg"
        :multiple="true"
        :file-list="fileListData"
        :list-type="'picture'"
        :headers="headers"
        :on-success="uploadFileChange"
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
                <div class="w-234px overflow-ellipsis">{{ file.name }}</div>
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
import { ElUpload, ElDialog, ElInput, ElButton, ElTooltip } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import type { UploadFile, UploadFiles } from 'element-plus'
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
  fileListData.value = list
  nextTick(() => {
    emit('change', list)
  })
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 文件移除
const removeFile = (file: UploadFile) => {
  fileListData.value = fileListData.value.filter((item) => item.url !== file.url)
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
    order: 1;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 0 !important;
    .el-upload-list__item {
      width: 358px;
      height: 90px;
      margin: 0 24px 16px 0;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #c3cbd9;
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
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
    }
  }
  .upload-delete {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 22px;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 358px;
    height: 90px;
    margin: 0 24px 16px 0;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #c3cbd9;
  }
}
</style>
