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
import { computed, ref } from 'vue'
import axios from 'axios'
import printJS from 'print-js'
import { ElDialog, ElButton, ElTooltip } from 'element-plus'
import { getPrintTemplateListApi, printLandlordApi } from '@/api/workshop/landlord/service'
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter()
const { type } = currentRoute.value.query as any
interface PropsType {
  show: boolean
  landlordIds: number[]
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

const getPrintList = async () => {
  let templateType = ''
  if (type == 'Enterprise') {
    templateType = 'printCompany'
  } else if (type == 'Landlord') {
    templateType = 'print'
  } else if (type == 'IndividualB') {
    templateType = 'printIndividualHousehold'
  }

  const res = await getPrintTemplateListApi({
    templateType: templateType
  })

  if (res && res.content) {
    const arr: PrintListType[] = []
    res.content.forEach((item) => {
      if (item.templateModule === '实物采集') {
        arr.push({
          name: item.templateName,
          url: item.templateUrl,
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
    return item
  })
}

const selectedTableIds = computed(() => {
  const ids: Array<string | number> = []
  list.value.forEach((item) => {
    if (item.selected) {
      ids.push(item.uid) // todo
    }
  })
  return ids
})

const downLoad = (url: string) => {
  const a = document.createElement('a')

  axios.get(url, { responseType: 'blob' }).then((res) => {
    if (!res || !res.data) return
    // 将链接地址字符内容转变成blob地址
    a.href = URL.createObjectURL(res.data)
    a.download = '居民户信息' // 下载文件的名字
    document.body.appendChild(a)
    a.click()

    //在资源下载完成后 清除 占用的缓存资源
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  })
}

const onDownLoad = async () => {
  const result = await printLandlordApi(selectedTableIds.value, props.landlordIds)
  if (result) {
    downLoad(result)
  }
}

const onPrint = async () => {
  const result = await printLandlordApi(selectedTableIds.value, props.landlordIds)
  if (result) {
    printJS(result)
  }
}

const onPreview = (item) => {
  window.open(`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`)
}
</script>

<style lang="less" scoped>
@page {
  margin: 18mm 15mm 8mm 15mm !important;
  size: A4 !important;
}

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
        user-select: none;
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
