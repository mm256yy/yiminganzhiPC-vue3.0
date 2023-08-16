<template>
  <div class="box-wrapper">
    <img :src="adminHomeSrc" alt="背景图" />
    <div class="household" @click="handleClickItem(0)"></div>
    <div class="enterprise" @click="handleClickItem(1)"></div>
    <div class="individual" @click="handleClickItem(2)"></div>
    <div class="village" @click="handleClickItem(3)"></div>
  </div>
</template>

<script lang="ts" setup>
import adminHomeSrc from '@/assets/imgs/admin-home.png'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const handleClickItem = (type: number) => {
  const pathMap = {
    0: 'LanlordEva', // 居民户
    1: 'EnterpriseEva', // 企业
    2: 'IndividualEva', // 个体户
    3: 'VillageCollectiveEva' // 村集体
  }

  push({ name: pathMap[type] })
}
</script>

<style lang="less" scoped>
.box-wrapper {
  position: relative;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
  }

  // 居民户
  .household {
    position: absolute;
    top: 110px;
    left: 20px;
    width: 450px;
    height: 220px;
    cursor: pointer;
  }

  // 企业
  .enterprise {
    position: absolute;
    top: 110px;
    left: 485px;
    width: 450px;
    height: 220px;
    cursor: pointer;
  }

  // 个体户
  .individual {
    position: absolute;
    top: 110px;
    right: 485px;
    width: 450px;
    height: 220px;
    cursor: pointer;
  }

  // 村集体
  .village {
    position: absolute;
    top: 110px;
    right: 20px;
    width: 450px;
    height: 220px;
    cursor: pointer;
  }
}
</style>
