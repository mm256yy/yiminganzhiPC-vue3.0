<template>
  <ElDialog
    title="打印表格"
    :model-value="props.show"
    :width="650"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
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
            {{ child.selected ? '选中' : '未选' }}
            <span class="view">预览</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" class="!bg-[#30A952] !border-[#30A952]" @click="onDownLoad"
        >下载</ElButton
      >
      <ElButton type="primary" @click="onPrint">打印</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElDialog, ElButton, ElCheckbox } from 'element-plus'

interface PropsType {
  show: boolean
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close'])

const list = ref([
  {
    uid: 99,
    name: 'ces1',
    selected: false,
    showAll: false,
    children: [
      {
        uid: 1,
        name: 'child 1',
        selected: false
      },
      {
        uid: 2,
        name: 'child 2',
        selected: false
      }
    ]
  },
  {
    uid: 66,
    name: 'ces11',
    selected: false,
    children: [
      {
        uid: 11,
        name: 'child 11',
        selected: false
      },
      {
        uid: 12,
        name: 'child 22',
        selected: false
      }
    ]
  }
])

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
  const ids: number[] = []
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

const onDownLoad = () => {
  console.log(selectedTableIds.value, 'ids')
}

const onPrint = () => {
  console.log(selectedTableIds.value, 'ids')
}
</script>

<style lang="less">
.collopase-item {
  width: 570px;
  height: 40px;
  margin: 0 auto 8px;
  overflow: hidden;
  transition: all 0.3s;

  .collopase-item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 16px;
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
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
      border-width: 5px;
      margin-top: 5px;
      border-color: transparent;
      border-style: solid;
      border-top-color: var(--el-color-primary);
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
