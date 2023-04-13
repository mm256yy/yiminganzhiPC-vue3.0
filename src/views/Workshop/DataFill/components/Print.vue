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
        <div class="print-rt" @click="onPreview(item)">
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
        >下载</ElButton
      >
      <ElButton type="primary" :disabled="selectedTableIds.length === 0" @click="onPrint"
        >打印</ElButton
      >
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { printPdf, getTemplate, handleLandlordWithPrint, landlordTestData } from '@/print'
import { PrintType, LandlordType } from '@/types/print'
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
import printJS from 'print-js'
import { ElDialog, ElButton, ElTooltip } from 'element-plus'
import { getLandlordBatchApi, printLandlordApi } from '@/api/workshop/landlord/service'
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

onMounted(() => {
  landlords.value = handleLandlordWithPrint(landlordTestData)
})

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
  if (type == 'Enterprise') {
    templateType = PrintType.printCompany
  } else if (type == 'Landlord') {
    templateType = PrintType.print
  } else if (type == 'IndividualB') {
    templateType = PrintType.printIndividualHousehold
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
const generatorPdf = (templateId?: number, returndataType?: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    // 拿到最新的调查对象信息
    if (!landlords.value) {
      const landlordArray = await getLandlordBatchApi([props.baseInfo.id])
      const realLandlords = handleLandlordWithPrint(landlordArray)
      // 缓存
      landlords.value = realLandlords
    }
    const templateIds = templateId ? [templateId] : selectedTableIds.value
    if (!templateIds.length) {
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
        // 预览：base64
        // 打印：[stream, stream]
        // 下载：
        // [{
        //   name: 'b',
        //   id: 2,
        //   pdfList: [
        //     {name: '', stream: ''}
        //   ]
        // }]
        if (actionType.value === 'preview') {
          resolve(result[0][0].data)
        } else if (actionType.value === 'download') {
          if (!result.length) {
            reject()
            return
          }
          const res = result.map((item, index) => {
            const currentLandlord = (landlords.value as LandlordType[])[index]
            const obj = {
              name: currentLandlord.name,
              id: currentLandlord.id,
              doorNo: currentLandlord.doorNo,
              pdfList: item
            }
            return obj
          })
          resolve(res)
        } else if (actionType.value === 'batchPrint') {
          const res: any[] = []
          if (result.length) {
            result.forEach((item) => {
              item.forEach((pdfItem) => {
                res.push(pdfItem.data)
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
  actionType.value = 'download'

  const result = await printLandlordApi(selectedTableIds.value, props.landlordIds)
  if (result) {
    downLoad(result)
  }
  generatorPdf().then((res) => {
    console.log(res, '下载参数')
  })
}

const onPrint = async () => {
  actionType.value = 'batchPrint'

  const result = await printLandlordApi(selectedTableIds.value, props.landlordIds)
  if (result) {
    printJS(result)
  }
  generatorPdf().then((res) => {
    console.log(res, '参数')
  })
}

const onPreview = async (item) => {
  console.log(item)

  actionType.value = 'preview'
  generatorPdf(item.uid, 'blob').then((res) => {
    const url = window.URL.createObjectURL(res)
    window.open(url)
  })
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
