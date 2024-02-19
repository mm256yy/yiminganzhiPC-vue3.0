<template>
  <ElDialog
    title="数据导入"
    :model-value="props.show"
    :width="650"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div>
      <el-checkbox-group v-model="checkList" @change="onCheckChange">
        <div class="collopase-item" v-for="item in props.list" :key="item.value">
          <div class="collopase-item-head">
            <el-checkbox :label="item.value">{{ item.name }}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: right">
        <ElButton @click="onClose" style="margin-right: 20px">取消</ElButton>
        <ElUpload
          action="/api/peasantHousehold/assetEvaluation/import"
          :headers="headers"
          :data="params"
          :show-file-list="false"
          accept=".xls,.xlsx"
          :before-upload="beforeUpload"
          :on-success="uploadDone"
          :on-error="uploadError"
        >
          <template #trigger>
            <ElButton type="primary" class="!bg-[#30A952] !border-[#30A952]">导入</ElButton>
          </template>
        </ElUpload>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getExportApi } from '@/api/workshop/export/service'
import { ElDialog, ElButton, ElCheckbox, ElCheckboxGroup, ElMessage, ElUpload } from 'element-plus'
const uploadLoading = ref(false)
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})
const uploadError = (error) => {
  try {
    const response = JSON.parse(error.message)
    ElMessage.error(response.message)
    uploadLoading.value = false
  } catch (err) {
    // err
  }
}
const uploadDone = () => {
  uploadLoading.value = false
  ElMessage({
    message: '导入成功',
    type: 'success'
  })
  // getList()
}

const beforeUpload = () => {
  uploadLoading.value = true
}

interface ExportListType {
  name: string
  value: string | number
}

interface PropsType {
  show: boolean
  list: ExportListType[]
  type?: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
let downloadLoading = ref(false)
const checkList = ref([])

const onClose = () => {
  checkList.value = []
  emit('close')
}
const params = ref<any>({
  projectId,
  householdType: props.type,
  templateKey: ''
})
const onCheckChange = (val) => {
  console.log(val, props.type)
  params.value.templateKey = val.join(',')
  // params.value.householdType = props.type
}
const onDownLoad = async () => {
  const res = await getExportApi({ peasantHouseholdType: props.type, type: checkList.value })
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}
</script>

<style lang="less" scoped>
.collopase-item {
  width: 570px;
  height: 40px;
  margin: 0 auto 8px;
  overflow: hidden;
  transition: all 0.3s;

  .collopase-item-head {
    display: flex;
    height: 40px;
    padding: 0 16px;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    align-items: center;
    justify-content: space-between;
  }

  .collopase-item-body {
    .body-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 0 16px;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      border-top: 0 none;

      .view {
        font-size: 14px;
        color: #3e73ec;
        cursor: pointer;
      }
    }
  }

  .circle-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    cursor: pointer;
    transition: all 0.3s;

    .circle-down {
      width: 0;
      height: 0;
      margin-top: 5px;
      border-color: transparent;
      border-top-color: var(--el-color-primary);
      border-style: solid;
      border-width: 5px;
    }
  }

  &.active {
    height: auto;

    .circle-wrap {
      transform: rotateZ(180deg);
    }
  }
}
</style>
