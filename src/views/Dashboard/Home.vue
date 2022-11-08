<template>
  <div :class="prefixCls" class="h-full px-10px text-center">
    <div class="text-size-30px mt-[10%]">移民安置综合管理平台</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('home')

onMounted(() => {
  // mounted
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-home';
</style>
