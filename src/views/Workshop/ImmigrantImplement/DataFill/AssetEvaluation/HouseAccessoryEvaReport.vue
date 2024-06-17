<template>
  <WorkContentWrap v-loading="loading">
    <ElButton type="primary" @click="onsetFeedback" style="float: right; margin: 20px 20px 20px 0px"
      >查看实物成果</ElButton
    >
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
    <Print
      :show="printDialog"
      :landlordIds="[householdId]"
      @close="onPrintDialogClose"
      :baseInfo="baseInfo"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElButton } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import {
  getDocumentationApi,
  getexportReportPdfApi,
  getPrintDetailsApi
} from '@/api/immigrantImplement/assetEvaluation/service'
import { WorkContentWrap } from '@/components/ContentWrap'
import Print from '@/views/Workshop/DataFill/components/Print.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
interface PropsType {
  doorNo: string
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}
const { currentRoute, back } = useRouter()
const { householdId } = currentRoute.value.query as any
const props = defineProps<PropsType>()
const appStore = useAppStore()

const houseEstimatePic = ref<FileItemType[]>([]) // 房屋附属物评估报告
const imgUrl = ref<string>('')
const printDialog = ref(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
const onPrintDialogClose = () => {
  printDialog.value = false
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
    pdfType: 1
  })
  const blob = new Blob([res.data], { type: 'application/pdf' })
  pdfUrl.value = window.URL.createObjectURL(blob)
  loading.value = false
}

// 处理函数

let onsetFeedback = () => {
  printDialog.value = true
}
watch(
  () => props.baseInfo.type,
  (val) => {
    if (val) {
      initData()
    }
  },
  { deep: true }
)
// onMounted(() => {
//   console.log(props.baseInfo.type, 'bbq')

//   initData()
// })
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
