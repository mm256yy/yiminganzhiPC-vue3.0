<template>
  <div class="flex-col section-chartBox">
    <div class="flex-row justify-between items-center group-chartBox">
      <div class="flex-row items-center">
        <div class="shrink-zero title-marker"></div>
        <span class="label-title">{{ props.title }}</span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<style lang="less" scoped>
.section-chartBox {
  padding: 0 32px 32px;
  margin: 24px 30px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16px;
  filter: drop-shadow(0px 0px 14px #0000000d);

  .group-chartBox {
    padding: 32px 0 16px;
  }
}
</style>
