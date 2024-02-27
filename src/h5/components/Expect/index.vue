<template>
  <div class="app-container">
    <div class="expect-center">
      <div>
        <img style="width: 180px; height: 150px" :src="iconExpectSrc" />
      </div>
      <span class="label-title">{{ props.title }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import iconExpectSrc from '@/h5/assets/imgs/icon_expect.png'

const props = defineProps<{
  title: string
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
    font-size: 34px;
    font-weight: 600;
    font-weight: bold;
    color: #666;
  }
}
</style>
