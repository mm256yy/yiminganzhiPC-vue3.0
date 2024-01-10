<template>
  <ElDialog
    title="资金发放详情"
    :model-value="props.show"
    width="80%"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElRow :gutter="20">
      <ElCol :span="12">
        <div class="segment-label">补偿费</div>
        <div>
          <ElTable :data="tableData" style="width: 100%">
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="name" label="应发" />
            <ElTableColumn prop="name" label="已发" />
          </ElTable>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="segment-label">奖励费</div>
        <div>
          <ElTable :data="tableData" style="width: 100%">
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="name" label="应发" />
            <ElTableColumn prop="name" label="已发" />
          </ElTable>
        </div>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="12">
        <div class="segment-label">补助费</div>
        <div>
          <ElTable :data="tableData" style="width: 100%">
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="name" label="应发" />
            <ElTableColumn prop="name" label="已发" />
          </ElTable>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="segment-label">其他</div>
        <div>
          <ElTable :data="tableData" style="width: 100%">
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="name" label="应发" />
            <ElTableColumn prop="name" label="已发" />
          </ElTable>
        </div>
      </ElCol>
    </ElRow>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElTable, ElTableColumn, ElRow, ElCol } from 'element-plus'
import { ref } from 'vue'
const emit = defineEmits(['close', 'updateDistrict'])

interface PropsType {
  show: any
}

const props = defineProps<PropsType>()
const tableData = ref<any[]>([])

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
}
</script>

<style lang="less">
.segment-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
