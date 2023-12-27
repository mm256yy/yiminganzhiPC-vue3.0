<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div v-loading="loading" id="LeaderSide_work_home_rem" class="LeaderSide">
    <div class="container">
      <LeftInfo v-model:loading="loading" class="left_info" />
      <ContainerInfo class="containerInfo" />
      <RightInfo />
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { changeScale, init } from './rem'
import LeftInfo from './components/left.vue'
import ContainerInfo from './components/container.vue'
import RightInfo from './components/right.vue'
import Footer from './components/footer.vue'

onMounted(() => {
  changeScale()
  window.addEventListener('resize', changeScale)
})
const loading = ref(false)
onBeforeUnmount(() => {
  init()
  window.removeEventListener('resize', changeScale)
})
</script>

<style lang="less" scoped>
.LeaderSide {
  width: 100%;

  height: 1016px;
  background: #e7edfd;
  border-radius: 8px 8px 8px 8px;

  .container {
    display: flex;
    padding-top: 10px;

    .left_info,
    .containerInfo {
      margin-right: 14px;
    }
  }
}
</style>
