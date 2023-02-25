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
            <span class="view" @click="onPreview(child)">预览</span>
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
import { uniqueId } from 'lodash-es'
import printJS from 'print-js'
import { ElDialog, ElButton, ElCheckbox } from 'element-plus'
import { getPrintTemplateListApi, printLandlordApi } from '@/api/workshop/landlord/service'

interface PropsType {
  show: boolean
  landlordIds: number[]
}

interface PrintListType {
  name: string
  selected: boolean
  showAll: boolean
  uid: string
  children: Array<Omit<PrintListType & { url: string }, 'children' | 'showAll'>>
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
const list = ref<PrintListType[]>([])

const getPrintList = async () => {
  const res = await getPrintTemplateListApi({
    templateType: 'print'
  })
  const map: {
    [key: string]: PrintListType
  } = {}
  if (res && res.content) {
    res.content.forEach((item) => {
      if (!map[item.templateModule]) {
        map[item.templateModule] = {
          name: item.templateModule,
          selected: false,
          showAll: false,
          uid: uniqueId('parent'),
          children: [
            {
              name: item.templateName,
              url: item.previewUrl,
              selected: false,
              uid: item.id
            }
          ]
        }
      } else {
        map[item.templateModule].children.push({
          name: item.templateName,
          url: item.previewUrl,
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
  const ids: Array<string | number> = []
  list.value.forEach((item) => {
    const { children } = item
    children.forEach((child) => {
      if (child.selected) {
        ids.push(child.uid) // todo
      }
    })
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
  // window.open(`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`)
  window.open(item.url)
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
