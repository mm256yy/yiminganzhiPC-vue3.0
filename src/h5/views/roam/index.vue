<template>
  <div class="page"> </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTokenApi } from './service'
// 测试跳转链接
const url =
  'https://mp.weixin.qq.com/mp/homepage?__biz=MzkyNjQ0ODE5NA==&hid=7&sn=5fd8e9ea3ee74013d3e88a80818693e5&scene=18&uin=&key=&devicetype=Windows+10+x64&version=6309080f&lang=zh_CN&ascene=1&session_us=gh_043f634f675b'
const route = useRoute()
const tokenStr = ref<string>()
// 区别两端不同url
const getTypeUrl = () => {
  return route.meta.type === 'leader' ? 'a' : 'b'
}

const requestToken = async () => {
  try {
    const result = await getTokenApi()
    tokenStr.value = result.token
  } catch {}
}

onMounted(() => {
  window.open(url)
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
  font-size: 16px;
  overflow-y: auto;
}
</style>
