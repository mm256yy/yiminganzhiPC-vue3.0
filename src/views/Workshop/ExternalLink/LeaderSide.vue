<template>
  <div> </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
const goLink = () => {
  let url = 'https://lanhuapp.com/link/#/invite?sid=lxetfKaa'
  window.open(url)
  console.log(1)
}

onMounted(() => {
  goLink()
})
</script>

<style scoped></style>
