<template>
  <Expect :title="expectStr" />
</template>
<script lang="ts" setup>
import Expect from '@/h5/components/Expect/index.vue'
const expectStr = '建设中，敬请期待...'
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  padding: 20px 0;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 24px;
  background-color: #f2f6ff;
}
</style>
