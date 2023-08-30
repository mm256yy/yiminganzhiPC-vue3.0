<template>
  <div>
    <TitleBar class="titleBar" :title="(route.meta.name as string)" />
    <RouterView class="routerView" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped lang="less">
.titleBar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
}

.routerView {
  margin-top: 75px;
}
</style>
