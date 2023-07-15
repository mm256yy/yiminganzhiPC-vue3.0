<template>
  <div class="box-wrapper">
    <img :src="thirdIndexSrc" />
  </div>
</template>

<script lang="ts" setup>
import thirdIndexSrc from '@/assets/imgs/third-index.png'
</script>

<style lang="less" scoped>
.box-wrapper {
  width: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
