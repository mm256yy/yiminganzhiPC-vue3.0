<template>
  <div :class="prefixCls" class="h-full px-10px flex flex-col justify-center items-center">
    <div class="text-size-30px mt-[10%]">移民安置综合管理平台</div>
    <a
      v-if="appStore.getIsProjectAdmin"
      class="text-blue-600 mt-40px cursor-pointer"
      @click="goProjectHome()"
    >
      项目工作平台
    </a>
  </div>
</template>

<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('home')
const appStore = useAppStore()

const goProjectHome = () => {
  window.open('/#/workshop/home')
}
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-home';
</style>
