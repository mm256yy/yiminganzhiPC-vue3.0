<script setup lang="ts">
import { ref, watch, computed, onMounted, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const title = computed(() => appStore.getTitle)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)
const reservoirName = computed(() => appStore.getReservoirName)
onMounted(() => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true
      return
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse
      }, 400)
    } else {
      show.value = !collapse
    }
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)
</script>

<template>
  <router-link
    :class="[
      prefixCls,
      layout !== 'classic' ? `${prefixCls}__Top` : '',
      'flex !h-[var(--logo-height)] items-center cursor-pointer relative',
      'dark:bg-[var(--el-bg-color)]'
    ]"
    to="/"
  >
    <img src="@/assets/imgs/logo.png" class="w-30px h-39px" />
    <span :class="['ml-10px text-24px font-600', 'text-[#fff]']"> {{ reservoirName }}</span>

    <div v-if="show" :class="['ml-10px text-24px font-600', 'text-[#fff]']">
      {{ title }}
    </div>
  </router-link>
</template>
