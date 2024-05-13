<template>
  <WorkContentWrap v-loading="loading">
    <!-- 房屋附属物评估报告 -->
    <!-- <ElRow v-if="houseEstimatePic.length">
      <ElCol :span="24">
        <div class="file-list">
          <ElUpload
            action="/api/file/type"
            :data="{
              type: 'archives'
            }"
            :disabled="true"
            :on-error="onError"
            :list-type="'picture-card'"
            accept=".jpg,.jpeg,.png,.pdf"
            :multiple="true"
            :file-list="houseEstimatePic"
            :headers="headers"
            :on-success="uploadFileChange"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
            :on-preview="imgPreview"
            :class="{
              reached_the_limit: true
            }"
          />
        </div>
      </ElCol>
    </ElRow>
    <div class="table-wrap !py-12px !mt-0px no-data" v-else>
      资产评估还未完成，无法查看评估报告
    </div>
    <ElDialog title="查看图片" :width="920" v-model="dialogVisible">
      <img
        class="block w-full"
        v-if="imgUrl.indexOf('pdf') == -1"
        :src="imgUrl"
        alt="Preview Image"
      />
      <iframe id="inlineFrameExample" v-else title="Inline Frame Example" :src="imgUrl"></iframe>
    </ElDialog> -->
    <iframe id="inlineFrameExample" :src="pdfUrl"></iframe>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElRow, ElCol, ElUpload, ElDialog } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import {
  getDocumentationApi,
  getexportReportPdfApi
} from '@/api/immigrantImplement/assetEvaluation/service'
import { WorkContentWrap } from '@/components/ContentWrap'

interface PropsType {
  doorNo: string
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const appStore = useAppStore()

const houseEstimatePic = ref<FileItemType[]>([]) // 房屋附属物评估报告
const imgUrl = ref<string>('')
const dialogVisible = ref(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 初始化获取数据
let pdfUrl = ref()
let loading = ref(false)
const initData = async () => {
  loading.value = true
  let res = await getexportReportPdfApi({
    doorNo: props.doorNo,
    type:
      props.baseInfo.type == 'Company'
        ? 'exportHouseEvalCompany'
        : props.baseInfo.type == 'IndividualHousehold'
        ? 'exportHouseEvalIndividual'
        : props.baseInfo.type == 'PeasantHousehold'
        ? 'exportHouseEvalHousehold'
        : props.baseInfo.type == 'Village'
        ? 'exportHouseEvalVillage'
        : 'exportHouseEvalHousehold',
    pdfType: 4
  })
  const blob = new Blob([res.data], { type: 'application/pdf' })
  pdfUrl.value = window.URL.createObjectURL(blob)
  loading.value = false
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
  houseEstimatePic.value = list
}

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

onMounted(() => {
  initData()
})
</script>
<style lang="less" scoped>
.file-list {
  display: flex;
  align-items: center;
  margin: 16px;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}

#inlineFrameExample {
  width: 100%;
  height: 700px;
}

.reached_the_limit {
  :deep(.el-upload) {
    display: none;
  }
}
</style>
