<template>
  <ElDialog
    title="打印表格"
    :model-value="props.show"
    :width="650"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div>
      <div
        class="collopase-item"
        :class="{ active: item.showAll }"
        v-for="item in list"
        :key="item.uid"
      >
        <div class="collopase-item-head">
          <el-checkbox
            :model-value="item.selected"
            @change="checkParentItem($event, item)"
            :label="item.name"
          />
          <div class="circle-wrap" @click="onCollopaseClick(item)">
            <span class="circle-down"></span>
          </div>
        </div>
        <div class="collopase-item-body">
          <div class="body-item" v-for="child in item.children" :key="child.uid">
            <el-checkbox
              :model-value="child.selected"
              @change="checkChildItem($event, child)"
              :label="child.name"
            />
            <span class="view" v-if="props.landlordIds.length < 2" @click="onPreview(child)"
              >预览</span
            >
          </div>
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
        :loading="downloadLoading"
        >下载</ElButton
      >
      <ElButton
        type="primary"
        :loading="printLoading"
        :disabled="selectedTableIds.length === 0"
        @click="onPrint"
      >
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
import { uniqueId } from 'lodash-es'
import printJS from 'print-js'
import { ElDialog, ElButton, ElCheckbox, ElMessage } from 'element-plus'
import {
  getLandlordBatchApi,
  batchPrintApi,
  downloadPrintPdfApi
} from '@/api/workshop/landlord/service'
import { formatDate } from '@/utils'
import { useAppStoreWithOut } from '@/store/modules/app'

interface PropsType {
  show: boolean
  landlordIds: number[]
  outsideData: any[]
  templateType: PrintType
}

interface PrintListType {
  name: string
  selected: boolean
  showAll: boolean
  uid: number | string
  children: Array<Omit<PrintListType & { url: string }, 'children' | 'showAll'>>
}

const appStore = useAppStoreWithOut()

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
const list = ref<PrintListType[]>([])
const outsideName = ref('')

// 当前调查对象的打印信息
const landlords = ref<LandlordType[] | null>()
// 操作类型
const actionType = ref<'preview' | 'download' | 'batchPrint'>('preview')
const downloadLoading = ref<boolean>(false)
const printLoading = ref<boolean>(false)

const projectInfo = computed(() => {
  const projects = appStore.getUserInfo?.projectUsers
  const currentProjectId = appStore.getCurrentProjectId
  const project = projects?.find((x) => x.projectId === currentProjectId)
  console.log(project, 'bbq')

  return {
    name: project?.projectName || '',
    status: project?.status || ''
  }
})

const printType = computed(() => {
  return props.templateType
})

const getPrintList = async () => {
  const res = getTemplate(printType.value)
  const map: {
    [key: string]: PrintListType
  } = {}
  if (res && res.length) {
    res.forEach((item) => {
      if (!map[item.templateModule]) {
        map[item.templateModule] = {
          name: item.templateModule,
          selected: false,
          showAll: false,
          uid: uniqueId('parent'),
          children: [
            {
              name: item.templateName,
              url: '',
              selected: false,
              uid: item.id
            }
          ]
        }
      } else {
        map[item.templateModule].children.push({
          name: item.templateName,
          url: '',
          selected: false,
          uid: item.id
        })
      }
    })
    const arr: PrintListType[] = []
    for (let key in map) {
      const val = map[key]
      arr.push(val)
    }

    list.value = arr
  }
}

getPrintList()

const onClose = () => {
  emit('close')
}

const onCollopaseClick = (item) => {
  item.showAll = !item.showAll
}

const checkParentItem = (val, parentItem) => {
  list.value = list.value.map((item) => {
    if (item.uid === parentItem.uid) {
      item.selected = val
      item.children = item.children.map((child) => {
        child.selected = val
        return child
      })
    }
    return item
  })
}

const checkChildItem = (val, childItem) => {
  list.value = list.value.map((item) => {
    item.children = item.children.map((child) => {
      if (child.uid === childItem.uid) {
        child.selected = val
      }
      return child
    })
    const selecteds = item.children.filter((child) => child.selected)
    if (selecteds.length === item.children.length) {
      item.selected = true
    } else {
      item.selected = false
    }
    return item
  })
}

const selectedTableIds = computed(() => {
  const ids: Array<number> = []
  list.value.forEach((item) => {
    const { children } = item
    children.forEach((child) => {
      if (child.selected) {
        ids.push(child.uid as number) // todo
        outsideName.value = child.name
      }
    })
  })
  return ids
})

const downLoad = (url: string) => {
  const a = document.createElement('a')
  let name = ''
  if (props.landlordIds.length < 2 && selectedTableIds.value.length < 2) {
    name = props.outsideData + outsideName.value
  } else if (props.landlordIds.length < 2 && selectedTableIds.value.length >= 2) {
    name = props.outsideData + '打印表'
  } else {
    name = `${
      props.templateType === PrintType.print
        ? '居民户打印表'
        : props.templateType === PrintType.printCompany
        ? '企业打印表'
        : '个体工商户打印表'
    }${formatDate(new Date())}`
  }

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
      const data = await getLandlordBatchApi(props.landlordIds).catch(() => {
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
  downloadLoading.value = true
  actionType.value = 'download'
  const res = await generatorPdf({
    returndataType: 'base64'
  }).catch(() => {
    downloadLoading.value = false
  })
  console.log('下载参数', res)
  if (res && res.length) {
    const result = await downloadPrintPdfApi(res).catch(() => {
      downloadLoading.value = false
      ElMessage.error('生成pdf失败')
    })
    result && downLoad(result)
    downloadLoading.value = false
  } else {
    downloadLoading.value = false
  }
}

const onPrint = async () => {
  if (!window.pdfMake || !window.pdfMake.fonts) {
    ElMessage.info('正在加载字体文件，请稍后')
    return
  }
  printLoading.value = true
  actionType.value = 'batchPrint'
  const res = await generatorPdf({
    returndataType: 'blob'
  }).catch(() => {
    printLoading.value = false
    ElMessage.error('生成pdf失败')
  })
  console.log('打印参数', res)
  if (res && res.length) {
    const formData = new window.FormData()
    res.forEach((file) => {
      formData.append('files', file)
    })
    const result = await batchPrintApi(formData).catch(() => {
      printLoading.value = false
    })
    result && printJS(result)
    printLoading.value = false
  } else {
    printLoading.value = false
  }
}

const onPreview = async (item) => {
  landlords.value = undefined
  if (!window.pdfMake || !window.pdfMake.fonts) {
    ElMessage.info('正在加载字体文件，请稍后')
    return
  }
  actionType.value = 'preview'
  const res = await generatorPdf({
    returndataType: 'blob',
    templateId: item.uid
  }).catch(() => {
    ElMessage.error('生成pdf失败')
  })
  if (res) {
    const url = window.URL.createObjectURL(res)
    url && window.open(url)
  }
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
