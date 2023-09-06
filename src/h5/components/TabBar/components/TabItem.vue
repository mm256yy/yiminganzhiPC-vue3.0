<template>
  <div class="itemWarp" @click="changePage">
    <img :src="active ? props.activeImg : normalImg" />
    <span :style="{ color: active ? '#3E73EC' : '#13131366' }">{{ props.txt }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { TabItemType } from '@/h5/types/home'

const props = defineProps<TabItemType>()
const emit = defineEmits(['change'])
const { push } = useRouter()

const active = computed(() => {
  const result = props.url === props.selected
  return result
})

const changePage = () => {
  push(props.url)
  emit('change', props.url)
}
</script>

<style lang="less" scoped>
.itemWarp {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 112px;
}

.itemWarp img {
  width: 40px;
  height: 40px;
}

.itemWarp span {
  height: 34px;
  margin-top: 8px;
  font-size: 24px;
  font-weight: 700;
  line-height: 34px;
}
</style>
