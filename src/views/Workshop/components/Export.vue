<template>
  <ElDialog
    title="数据导出"
    :model-value="props.show"
    :width="650"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div>
      <el-checkbox-group v-model="checkList">
        <div class="collopase-item" v-for="item in props.list" :key="item.value">
          <div class="collopase-item-head">
            <el-checkbox :label="item.value">{{ item.name }}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton
        type="primary"
        class="!bg-[#30A952] !border-[#30A952]"
        :disabled="checkList.length === 0"
        @click="onDownLoad"
        :loading="downloadLoading"
        >导出</ElButton
      >
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getExportApi, getPgExportApi } from '@/api/workshop/export/service'
import { ElDialog, ElButton, ElCheckbox, ElCheckboxGroup } from 'element-plus'

interface ExportListType {
  name: string
  value: string | number
}

interface PropsType {
  show: boolean
  list: ExportListType[]
  type?: string
  flag?: number
  serse?: any
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
let downloadLoading = ref(false)
const checkList = ref([])

const onClose = () => {
  checkList.value = []
  emit('close')
}

const onDownLoad = async () => {
  console.log(props.serse, checkList.value, '1111')
  downloadLoading.value = true
  if (props.flag != 1) {
    const res = await getExportApi({
      peasantHouseholdType: props.type,
      type: checkList.value
    })
    getRes(res)
  } else {
    const res = await getPgExportApi({
      type: props.type,
      templateKey: checkList.value,
      ...props.serse
    })
    getRes(res)
  }
  downloadLoading.value = false
}

const getRes = (res: any) => {
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
