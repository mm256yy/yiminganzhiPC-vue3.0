<template>
  <div>
    <TitleBar :title="(route.meta.name as string)" />
    <RouterView class="routerView" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped lang="less"></style>
