<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div id="LeaderSide_work_home_rem" class="LeaderSide">
    <div class="container">
      <LeftInfo class="left_info" />
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

import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'

onMounted(() => {
  changeScale()
  window.addEventListener('resize', changeScale)
})

onBeforeUnmount(() => {
  init()
  window.removeEventListener('resize', changeScale)
})
</script>

<style lang="less" scoped>
.LeaderSide {
  width: 100%;

  height: 1016px;
  border-radius: 8px 8px 8px 8px;
  background: #e7edfd;
  .container {
    display: flex;
    padding-top: 10px;

    .left_info,
    .containerInfo {
      margin-right: 14px;
    }
  }
  .footer {
  }
}
</style>
