<template>
  <div class="box-wrapper">
    <img :src="secondIndexSrc" />
    <div class="qualification" @click="handleClickItem"></div>
  </div>
</template>

<script lang="ts" setup>
import secondIndexSrc from '@/assets/imgs/second-index.png'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const handleClickItem = () => {
  push({ path: 'adminThirdHome' })
}
</script>

<style lang="less" scoped>
.box-wrapper {
  width: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .qualification {
    position: absolute;
    top: 520px;
    left: 10px;
    width: 620px;
    height: 360px;
    cursor: pointer;
  }
}
</style>
