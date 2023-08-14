<template>
  <WorkContentWrap>
    <!-- 个体户相关手续 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-14px">
        <div class="table-header-left">
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="desc">
            上传说明：请将上传的图片进行文字命名，图片为
            <span class="unit">jpg、png</span> 格式且图片大小需小于5M
          </div>
        </div>
        <ElSpace>
          <ElButton
            :icon="saveIcon"
            :loading="loading"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>

      <UploadItem :fileList="proceduresPic" title="其他凭证" @change="fileChange" />
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import { ElMessage, ElSpace, ElButton } from 'element-plus'
import { getDocumentationApi, saveDocumentationApi } from '@/api/immigrantImplement/common-service'
import { WorkContentWrap } from '@/components/ContentWrap'
import UploadItem from './UploadItem.vue'

interface FileItemType {
  name: string
  url: string
}

interface PropsType {
  doorNo: string
}

const props = defineProps<PropsType>()
const proceduresPic = ref<FileItemType[]>([])
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const loading = ref(false)

const initData = () => {
  getDocumentationApi(props.doorNo).then((res: any) => {
    if (res) {
      if (res.proceduresPic) {
        proceduresPic.value = JSON.parse(res.proceduresPic)
      }
    }
  })
}

const fileChange = (list: FileItemType[]) => {
  proceduresPic.value = list
}

const onSave = () => {
  loading.value = true
  let params: any = {
    doorNo: props.doorNo,
    proceduresPic: JSON.stringify(proceduresPic.value || [])
  }
  saveDocumentationApi(params)
    .then(() => {
      ElMessage.success('操作成功！')
      loading.value = false
      initData()
    })
    .catch(() => {
      ElMessage.error('操作失败！')
      loading.value = false
    })
}

onMounted(() => {
  initData()
})
</script>
<style lang="less" scoped>
.desc {
  padding-left: 10px;
  font-size: 12px;
  color: #000000;

  .unit {
    color: var(--el-color-primary);
  }
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}
</style>
