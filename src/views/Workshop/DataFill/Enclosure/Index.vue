<template>
  <div class="p-16px">
    <div class="flex items-center justify-between pb-12px">
      <div> </div>
      <ElSpace>
        <ElButton
          :icon="saveIcon"
          type="primary"
          class="!bg-[#30A952] !border-[#30A952]"
          @click="onSave"
          >保存</ElButton
        >
      </ElSpace>
    </div>
    <UploadItem title="其他附件上传" @change="fileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UploadItem from './UploadItem.vue'
import { useIcon } from '@/hooks/web/useIcon'
import { ElMessage, ElSpace, ElButton } from 'element-plus'
import {
  getEnclosureListApi,
  saveEnclosureListApi
} from '@/api/workshop/datafill/enclosure-service'
// import { EnclosureDtoType } from '@/api/workshop/datafill/enclosure-types'

interface FileItemType {
  name: string
  url: string
}
interface PropsType {
  householdId: number
  doorNo: string
}

const props = defineProps<PropsType>()
const otherPic = ref<FileItemType[]>([])
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const getList = () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId
  }
  getEnclosureListApi(params).then((res) => {
    console.log(res, 'res')
  })
}

getList()

const fileChange = (list: FileItemType[]) => {
  otherPic.value = list
}

const onSave = () => {
  saveEnclosureListApi({
    otherPic: JSON.stringify(otherPic.value)
  }).then((res) => {
    console.log(res, 'res')
    ElMessage.success('操作成功！')
  })
}
</script>
