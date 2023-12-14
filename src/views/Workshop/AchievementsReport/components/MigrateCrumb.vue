<template>
  <div class="flex items-center mb-8px">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem v-for="(item, index) in props.titles" :key="index" class="text-size-12px">{{
        item
      }}</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'

const props = defineProps<{
  titles: string[]
}>()

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { back } = useRouter()
const onBack = () => {
  back()
}
</script>

<style scoped></style>
