<template>
  <div class="icon-wrap">
    <el-input
      :modelValue="name"
      @input="onChange"
      :prefix-icon="Search"
      placeholder="请输入图标名称"
    />
    <div class="icon-list" v-if="iconList && iconList.length">
      <div class="icon-item" v-for="item in iconList" :key="item" @click="selectedIcon(item)">
        <span class="text-40px">
          <span class="iconify" :data-icon="item"></span>
        </span>
      </div>
    </div>
    <ElEmpty v-else :image-size="150" />
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue'
import { throttle } from 'lodash-es'
import { ElInput, ElEmpty } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { AntdIcons } from './iconConfig'

const defaultIconList = AntdIcons
const name = ref<string>('')
const iconList = ref(defaultIconList)
const Search = useIcon({ icon: 'ant-design:search-outlined' })
const emit = defineEmits(['selected'])

const updateIconList = throttle((name: string) => {
  iconList.value = defaultIconList.filter((item) => item.includes(name))
}, 200)

const onChange = (val) => {
  name.value = val
  updateIconList(val)
}

const selectedIcon = (name) => {
  emit('selected', name)
}

const reset = () => {
  name.value = ''
  updateIconList('')
}

defineExpose({
  reset
})
</script>

<style lang="less">
.icon-list {
  display: flex;
  flex-wrap: wrap;
  max-height: 300px;
  padding: 20px 6px;
  overflow-y: scroll;

  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    :hover {
      background-color: var(--el-color-primary);
    }
  }
}
</style>
