<template>
  <div class="page"> </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTokenApi } from './service'
import { isIOS } from '@/h5/utils'

// 测试跳转链接
const url = 'https://jingling-h5-test.jldt.top/token?'
const route = useRoute()
const tokenStr = ref<string>()

// 统一跳转
const uniformJump = (targetUrl: string) => {
  if (isIOS()) {
    window.location.href = targetUrl
  } else {
    window.open(targetUrl)
  }
}

const requestToken = async () => {
  try {
    const result = await getTokenApi()
    tokenStr.value = result.token
    let targetUrl = `${url}token=${tokenStr.value}`
    uniformJump(targetUrl)
  } catch {}
}

onMounted(() => {
  if (route.meta.type === 'leader') {
    // 领导端
    // 动态获取
    requestToken()
  } else {
    // 移民端
    const h5Token = sessionStorage.getItem('h5token')
    let targetUrl = `${url}token=${h5Token}`
    uniformJump(targetUrl)
  }
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;

  overflow-y: auto;
  font-size: 16px;
}
</style>
