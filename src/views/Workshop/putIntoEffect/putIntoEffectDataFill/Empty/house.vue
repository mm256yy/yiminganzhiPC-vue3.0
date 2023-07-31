<template>
  <div class="empty-wrap">
    <div class="empty-head">
      <div class="title">房屋腾空办理情况</div>
      <ElSpace>
        <ElButton type="primary" @click="onHandle">办理</ElButton>
        <ElButton type="primary" @click="onNoHandle">无须办理</ElButton>
      </ElSpace>

      <ElSpace>
        <ElButton :icon="addIcon" type="primary" @click="onSortSave">归档</ElButton>
        <ElButton type="primary" @click="onPrintTable">打印报表</ElButton>
      </ElSpace>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElSpace, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'

const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const onHandle = () => {
  console.log(8888)
}

const onNoHandle = () => {
  console.log(9999)
}

const onSortSave = () => {
  console.log(9999)
}

const onPrintTable = () => {
  console.log(9999)
}
</script>

<style scoped lang="less"></style>
