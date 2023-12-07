<template>
  <RouterView />
  <TabBar :type="(route.meta.type as string)" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TabBar from '../components/TabBar/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
