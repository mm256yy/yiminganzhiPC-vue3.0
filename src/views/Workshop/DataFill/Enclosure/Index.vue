<template>
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

    <UploadItem :fileList="otherPic" title="其他附件上传" @change="fileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UploadItem from './UploadItem.vue'
import { useIcon } from '@/hooks/web/useIcon'
import { ElMessage, ElSpace, ElButton } from 'element-plus'
import {
  getEnclosureListApi,
  updateEnclosureListApi,
  addEnclosureListApi
} from '@/api/workshop/datafill/enclosure-service'
// import { EnclosureDtoType } from '@/api/workshop/datafill/enclosure-types'
interface FileItemType {
  name: string
  url: string
}
interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()
const otherPic = ref<FileItemType[]>([])
const id = ref<number>()
const uid = ref<string>('')
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const loading = ref(false)

const getList = () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId
  }
  getEnclosureListApi(params).then((res) => {
    if (res && res.content && res.content.length) {
      id.value = res.content[0].id
      otherPic.value = JSON.parse(res.content[0].otherPic)
      uid.value = res.content[0].uid
    }
  })
}

getList()

const fileChange = (list: FileItemType[]) => {
  otherPic.value = list
}

const onSave = () => {
  loading.value = true
  if (id.value) {
    updateEnclosureListApi({
      id: id.value,
      doorNo: props.doorNo,
      householdId: +props.householdId,
      otherPic: JSON.stringify(otherPic.value),
      uid: uid.value
    })
      .then(() => {
        ElMessage.success('操作成功！')
        loading.value = false
        getList()
      })
      .catch(() => {
        ElMessage.error('操作失败！')
        loading.value = false
      })
  } else {
    addEnclosureListApi({
      doorNo: props.doorNo,
      householdId: +props.householdId,
      otherPic: JSON.stringify(otherPic.value),
      uid: uid.value
    })
      .then(() => {
        ElMessage.success('操作成功！')
        loading.value = false
        getList()
      })
      .catch(() => {
        ElMessage.error('操作失败！')
        loading.value = false
      })
  }
}
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
</style>
