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
  householdId: number
  doorNo: string
}

const props = defineProps<PropsType>()
const otherPic = ref<FileItemType[]>([])
const id = ref<number>()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const getList = () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId
  }
  getEnclosureListApi(params).then((res) => {
    console.log(res, 'res')
    if (res && res.content && res.content.length) {
      id.value = res.content[0].id
      otherPic.value = JSON.parse(res.content[0].otherPic)
    }
  })
}

getList()

const fileChange = (list: FileItemType[]) => {
  otherPic.value = list
}

const onSave = () => {
  if (id.value) {
    updateEnclosureListApi({
      id: id.value,
      doorNo: props.doorNo,
      householdId: props.householdId,
      otherPic: JSON.stringify(otherPic.value)
    }).then(() => {
      ElMessage.success('操作成功！')
    })
  } else {
    addEnclosureListApi({
      doorNo: props.doorNo,
      householdId: props.householdId,
      otherPic: JSON.stringify(otherPic.value)
    }).then(() => {
      ElMessage.success('操作成功！')
    })
  }
}
</script>
