<template>
  <ElDialog
    title="打印表格"
    :model-value="props.show"
    :width="500"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div class="print-box">
      <div
        :class="{ 'print-item': true, active: item.selected }"
        v-for="item in list"
        :key="item.uid"
      >
        <div class="print-lt" @click="toggleItem(item)">
          <ElTooltip content="点击选择/取消" placement="top-start">
            <div class="name">{{ item.name }}</div>
          </ElTooltip>
        </div>
        <div v-loading.fullscreen.lock="loading" class="print-rt" @click="onPreview(item)">
          <Icon icon="fontisto:preview" color="var(--el-color-primary)" />
        </div>
        <div class="select-icon">
          <Icon class="icon" icon="ant-design:check-outlined" :size="12" color="#ffffff" />
        </div>
      </div>
    </div>
    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton
        type="primary"
        class="!bg-[#30A952] !border-[#30A952]"
        :disabled="selectedTableIds.length === 0"
        @click="onDownLoad"
      >
        下载
      </ElButton>
      <ElButton type="primary" :disabled="selectedTableIds.length === 0" @click="onPrint">
        打印
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { printPdf, getTemplate, handleLandlordWithPrint } from '@/print'
import { PrintType, LandlordType } from '@/types/print'
import { computed, ref } from 'vue'
import axios from 'axios'
import printJS from 'print-js'
import { ElDialog, ElButton, ElTooltip, ElMessage } from 'element-plus'
import {
  getLandlordBatchApi,
  batchPrintApi,
  downloadPrintPdfApi
} from '@/api/workshop/landlord/service'
import { useRouter } from 'vue-router'
import { useAppStoreWithOut } from '@/store/modules/app'

const appStore = useAppStoreWithOut()
const { currentRoute } = useRouter()
const { type } = currentRoute.value.query as any
interface PropsType {
  show: boolean
  landlordIds: number[]
  baseInfo: any
}

interface PrintListType {
  name: string
  selected: boolean
  url: string
  uid: number
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
const list = ref<PrintListType[]>([])
const downName = ref('')
// 当前调查对象的打印信息
const landlords = ref<LandlordType[] | null>()
// 操作类型
const actionType = ref<'preview' | 'download' | 'batchPrint'>('preview')
const loading = ref<boolean>(false)

const projectInfo = computed(() => {
  const projects = appStore.getUserInfo?.projectUsers
  const currentProjectId = appStore.getCurrentProjectId
  const project = projects?.find((x) => x.projectId === currentProjectId)
  return {
    name: project?.projectName || '',
    status: project?.status || ''
  }
})

const printType = computed(() => {
  let templateType = PrintType.print
  if (type == 'Enterprise' || type == 'Company') {
    templateType = PrintType.printCompany
  } else if (type == 'Landlord' || type == 'PeasantHousehold') {
    templateType = PrintType.print
  } else if (type == 'IndividualB' || type == 'IndividualHousehold') {
    templateType = PrintType.printIndividualHousehold
  } else {
    templateType = PrintType.village
  }
  return templateType
})

const getPrintList = () => {
  const res = getTemplate(printType.value)
  console.log(res)

  if (res && res.length) {
    const arr: PrintListType[] = []
    res.forEach((item) => {
      if (item.templateModule === '实物采集') {
        arr.push({
          name: item.templateName,
          url: '',
          selected: false,
          uid: item.id
        })
      }
    })

    list.value = arr
  }
}

getPrintList()

const onClose = () => {
  emit('close')
}

const toggleItem = (currentItem) => {
  list.value = list.value.map((item) => {
    if (item.uid === currentItem.uid) {
      item.selected = !item.selected
    }
    if (item.selected) {
      downName.value = item.name
    }
    return item
  })
}

const selectedTableIds = computed(() => {
  const ids: Array<number> = []
  list.value.forEach((item) => {
    if (item.selected) {
      ids.push(item.uid)
    }
  })
  return ids
})

const downLoad = (url: string) => {
  let name = ''
  if (selectedTableIds.value.length < 2) {
    name = props.baseInfo.name + downName.value
  } else {
    name = props.baseInfo.name + '打印表'
  }
  console.log(name)

  const a = document.createElement('a')
  axios.get(url, { responseType: 'blob' }).then((res) => {
    if (!res || !res.data) return
    // 将链接地址字符内容转变成blob地址
    a.href = URL.createObjectURL(res.data)
    a.download = name // 下载文件的名字
    document.body.appendChild(a)
    a.click()

    //在资源下载完成后 清除 占用的缓存资源
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  })
}

/**
 * 生成pdf数据
 * templateId 模版id
 * returndataType pdf数据类型
 */
const generatorPdf = (options?: { templateId?: number; returndataType?: string }): Promise<any> => {
  const { templateId, returndataType } = options || {}
  return new Promise(async (resolve, reject) => {
    // 拿到最新的调查对象信息
    if (!landlords.value) {
      const data = await getLandlordBatchApi({
        doorNo: props.baseInfo.doorNo,
        status: 'review'
      }).catch(() => {
        reject()
      })
      const { peasantHouseholdPushDtoList, immigrantGraveList } = data || {}
      if (peasantHouseholdPushDtoList) {
        const realLandlords = handleLandlordWithPrint(
          peasantHouseholdPushDtoList,
          immigrantGraveList || []
        )
        // 缓存
        landlords.value = realLandlords
      } else {
        landlords.value = []
      }
    }
    const templateIds = templateId ? [templateId] : selectedTableIds.value
    if (!templateIds.length) {
      reject()
      return
    }
    // 生成pdf数据
    printPdf
      .getPdf({
        landlords: landlords.value,
        templateIds,
        type: printType.value,
        projectInfo: projectInfo.value,
        returndataType: returndataType || ''
      })
      .then((result) => {
        if (!result) {
          reject()
        }
        console.log(result, '生成的结果')
        // 根据 actionType 不同 返回不同的数据格式
        // 预览：blob
        // 打印：[bolb => file]
        // 下载：
        // [{
        //   doorNo: '',
        //   name: 'b',
        //   id: 2,
        //   files: [
        //     {name: '', file: base64}
        //   ]
        // }]
        if (actionType.value === 'preview') {
          // 需要bolb格式的pdf
          resolve(result[0][0].file)
        } else if (actionType.value === 'download') {
          if (!result.length) {
            reject()
            return
          }
          // 传入base64格式的json数据
          const res = result.map((item, index) => {
            const currentLandlord = (landlords.value as LandlordType[])[index]
            const obj = {
              name: currentLandlord.name,
              id: currentLandlord.id,
              doorNo: currentLandlord.doorNo,
              showDoorNo: currentLandlord.showDoorNo,
              files: item
            }
            // item.map((pdfItem) => {
            //     return {
            //       name: pdfItem.name,
            //       file: printPdf.blobToFile(pdfItem.file, pdfItem.name, 'application/pdf')
            //     }
            //   })
            return obj
          })
          resolve(res)
        } else if (actionType.value === 'batchPrint') {
          // 传入文件数组
          const res: any[] = []
          if (result.length) {
            result.forEach((item) => {
              item.forEach((pdfItem) => {
                res.push(printPdf.blobToFile(pdfItem.file, pdfItem.name, 'application/pdf'))
              })
            })
          }
          resolve(res)
        }
      })
      .catch(() => {
        reject()
      })
  })
}

const onDownLoad = async () => {
  if (!window.pdfMake || !window.pdfMake.fonts) {
    ElMessage.info('正在加载字体文件，请稍后')
    return
  }
  actionType.value = 'download'
  const res = await generatorPdf({
    returndataType: 'base64'
  }).catch(() => {
    ElMessage.error('生成pdf失败')
  })
  console.log('下载参数', res)
  if (res && res.length) {
    const result = await downloadPrintPdfApi(res)
    result && downLoad(result)
  }
}

const onPrint = async () => {
  if (!window.pdfMake || !window.pdfMake.fonts) {
    ElMessage.info('正在加载字体文件，请稍后')
    return
  }
  actionType.value = 'batchPrint'
  const res = await generatorPdf({
    returndataType: 'blob'
  }).catch(() => {
    ElMessage.error('生成pdf失败')
  })
  console.log('打印参数', res)
  if (res && res.length) {
    const formData = new window.FormData()
    res.forEach((file) => {
      formData.append('files', file)
    })
    const result = await batchPrintApi(formData)
    result && printJS(result)
  }
}

const onPreview = async (item) => {
  if (!window.pdfMake || !window.pdfMake.fonts) {
    ElMessage.info('正在加载字体文件，请稍后')
    return
  }
  loading.value = true
  actionType.value = 'preview'
  const res = await generatorPdf({
    returndataType: 'blob',
    templateId: item.uid
  })
    .catch(() => {
      ElMessage.error('生成pdf失败')
    })
    .finally(() => {
      loading.value = false
    })
  if (res) {
    loading.value = false
    const url = window.URL.createObjectURL(res)
    url && window.open(url)
  }
}
</script>

<style lang="less" scoped>
.print-box {
  padding-left: 16px;

  .print-item {
    position: relative;
    display: flex;
    width: 430px;
    padding: 20px;
    margin-bottom: 16px;
    overflow: hidden;
    background: #f6f6f6;
    border: 1px solid #ebebeb;
    border-radius: 4px;
    align-items: center;
    justify-content: space-between;

    &:last-child {
      margin-bottom: 0;
    }

    .print-lt {
      width: 336px;
      height: 100%;
      cursor: pointer;

      .name {
        font-size: 14px;
        line-height: 20px;
        color: #131313;
        // user-select: none;
      }
    }

    .print-rt {
      width: 16px;
      cursor: pointer;
    }

    .select-icon {
      position: absolute;
      top: -9px;
      right: -14px;
      display: none;
      width: 34px;
      height: 24px;
      background-color: var(--el-color-primary);
      transform: rotate(45deg);
      justify-content: center;
      align-items: flex-end;

      .icon {
        transform: rotate(-45deg);
      }
    }

    &.active {
      border: 1px solid #3e73ec;

      .select-icon {
        display: flex;
      }
    }
  }
}
</style>
