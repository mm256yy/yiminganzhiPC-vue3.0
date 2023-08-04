<template>
  <div>设备设施评估{{ props.doorNo }}</div>
</template>
<script lang="ts" setup>
interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
  baseInfo: any
}

const props = defineProps<PropsType>()
</script>
