<template>
  <div class="app-container">
    <div class="expect-center">
      <div>
        <img style="width: 120px; height: 120px" :src="iconEmptySrc" />
      </div>
      <span class="label-title">{{ props.title || '暂无数据' }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import iconEmptySrc from '@/h5/assets/imgs/icon_empty.png'

const props = defineProps<{
  title?: string
}>()
</script>

<style lang="less" scoped>
.expect-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;

  .label-title {
    margin-top: 40px;
    font-size: 30px;
    font-weight: 600;
    font-weight: bold;
    color: #666;
  }
}
</style>
