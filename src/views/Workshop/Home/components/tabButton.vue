<template>
  <div class="btn">
    <ElButton
      v-for="(item, index) in props.tabList"
      :key="index"
      @click="onTab(index)"
      :type="getButtonType(index)"
      >{{ item.title }}</ElButton
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
const currentIndex = ref<number>(0)
interface PropsType {
  tabList: any
  link?: boolean
}

const props = defineProps<PropsType>()
const emit = defineEmits(['tab', 'tabVillageAnalysis', 'tabHouse', 'tabCareer', 'tabPerson'])

const getButtonType = (index: number) => {
  return currentIndex.value === index ? 'primary' : ''
}
const onTab = (index) => {
  currentIndex.value = index
  emit('tab', index)
  emit('tabVillageAnalysis', index)
  emit('tabHouse', index)
  emit('tabCareer', index)
  emit('tabPerson', index)
}
</script>

<style scoped>
.btn {
  display: flex;
  padding: 10px;
  justify-content: right;
}
</style>
