<template>
  <div class="header-wrapper">
    <div class="center-title">
      {{ props.title }}
    </div>
    <div v-if="showBack" class="back-img" @click="goBack">
      <img :src="iconCloseSrc" alt="关闭" />
    </div>
    <div class="title-right">
      <slot name="title-right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import iconCloseSrc from '@/h5/assets/imgs/icon_close_back.png'
import { topLevelRouteNames } from '../config'

const props = defineProps<{
  title: string
}>()

// 是否显示返回按钮
const showBack = computed(() => {
  return !topLevelRouteNames.includes(props.title)
})

const { back } = useRouter()

const goBack = () => {
  back()
}
</script>

<style lang="less" scoped>
.header-wrapper {
  background: #fff;

  .center-title {
    height: 75px;
    font-size: 34px;
    font-weight: bold;
    line-height: 75px;
    color: #000000;
    text-align: center;
  }

  .back-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 75px;
    height: 75px;

    img {
      width: 100%;
      height: 100%;
      padding: 20px;
    }
  }

  .title-right {
    position: absolute;
    top: 12px;
    right: 15px;
  }
}
</style>
