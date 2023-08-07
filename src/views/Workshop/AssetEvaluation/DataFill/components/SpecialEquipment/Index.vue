<template>
  <div>小型专项及农副业设施评估 {{ props.doorNo }}</div>
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
