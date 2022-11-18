<template>
  <el-form-item label="菜单图标" :prop="props.prop || 'icon'">
    <el-popover
      placement="bottom"
      width="480"
      trigger="click"
      @show="showPop"
      popper-class="popper-class"
    >
      <IconSelect ref="iconSelectRef" @selected="selectedIcon" />
      <template #reference>
        <el-input :model-value="iconName" placeholder="请输入内容" style="cursor: pointer">
          <template #prepend>
            <Icon :icon="iconName" />
          </template>
        </el-input>
      </template>
    </el-popover>
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, defineProps, nextTick } from 'vue'
import { ElPopover, ElInput, ElFormItem } from 'element-plus'
import IconSelect from './IconSelect.vue'

interface IProps {
  icon?: string
  prop?: string
}

const props = defineProps<IProps>()
const emit = defineEmits(['change'])

const iconSelectRef = ref()
const iconName = ref(props.icon || '')

const selectedIcon = (name) => {
  iconName.value = name
  emit('change', name)
}
const showPop = () => {
  nextTick(() => {
    iconSelectRef.value?.reset()
  })
}
</script>
