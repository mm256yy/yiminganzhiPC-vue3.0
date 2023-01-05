<template>
  <div class="upload-wrap">
    <div class="upload-title">
      <span class="line"></span>
      <div class="tit">{{ props.title }}</div>
      <Icon color="var(--el-color-primary)" icon="material-symbols:info-outline-rounded" />
      <div class="desc">
        上传说明：请将上传的图片进行文字命名，图片为
        <span class="unit">jpg、png、svg</span> 格式
      </div>
    </div>
    <div class="upload-cont">
      <ElUpload
        action="/api/file/type"
        :data="{
          type: 'image'
        }"
        accept=".jpg,.jpeg,.png,.svg"
        :multiple="true"
        :file-list="fileListData"
        :list-type="'picture-card'"
        :headers="headers"
        :on-success="uploadFileChange"
        :before-remove="() => false"
      >
        <template #trigger>
          <Icon icon="ant-design:plus-outlined" :size="22" />
        </template>

        <template #file="{ file }">
          <div class="relative">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <ElInput class="mt-8px" v-model="file.name" placeholder="请更换名称" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="imgPreview(file)">
                <Icon icon="bi:zoom-in" />
              </span>

              <span class="el-upload-list__item-delete" @click="removeFile(file)">
                <Icon icon="material-symbols:delete-outline" />
              </span>
            </span>
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
import { ElUpload, ElDialog, ElInput } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import type { UploadFile, UploadFiles } from 'element-plus'

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

<style lang="less" scoped>
.upload-wrap {
  margin-bottom: 16px;
  background: #f6f6f6;
  border-radius: 4px;
  border: 1px solid #ebebeb;

  .upload-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 16px;
    border-bottom: 1px dashed #dcdfe6;
    .line {
      width: 4px;
      height: 16px;
      background: linear-gradient(90deg, var(--el-color-primary) 0%, #ffffff 100%);
      border-radius: 3px;
    }
    .tit {
      margin: 0 35px 0 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color-1);
    }
    .desc {
      font-size: 12px;
      color: #000000;
      .unit {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>

<style lang="less">
.upload-cont {
  padding: 14px 16px;
  .el-upload-list__item {
    margin-bottom: 40px;
    overflow: visible !important;
  }
}
</style>
