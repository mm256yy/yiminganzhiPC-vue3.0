<template>
  <div class="btn">
    <ElButton
      v-for="(item, index) in props.tabList"
      :key="index"
      @click="onTab(index)"
      :text="link"
      >{{ item.title }}</ElButton
    >
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
interface PropsType {
  tabList: any
  link?: boolean
}

const props = defineProps<PropsType>()
const emit = defineEmits(['tab', 'tabVillageAnalysis', 'tabHouse', 'tabCareer', 'tabPerson'])
const onTab = (index) => {
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
