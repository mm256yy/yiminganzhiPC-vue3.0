<template>
  <div class="center">
    <div class="flex">
      <div class="bottom-style">Copyright ©2015 zdwp All Rights Reserved.</div>
      <div class="bottom-style">浙ICP备10000403号-1</div>
      <div class="bottom-style">浙公网安备 33010202000111号</div>
      <div class="bottom-style">网站建设运维：浙水设计</div>
      <div class="bottom-style" @click="goLink" style="color: #3e73ec; cursor: pointer"
        >联系我们</div
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const goLink = () => {
  let url = 'https://lanhuapp.com/link/#/invite?sid=lxetfKaa'
  window.open(url)
}
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.center {
  display: flex;
  justify-content: center;
}

.bottom-style {
  margin-right: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 63px;
  color: rgba(19, 19, 19, 0.4);
}
</style>
