<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView'
import { computed } from 'vue'

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
</script>

<template>
  <section class="bg-[#E7EDFD] px-16px pt-6px pb-16px rounded-8px min-h-[100%]">
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
</template>
