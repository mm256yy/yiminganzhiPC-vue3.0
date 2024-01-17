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
    <ElRow>
      <ElCol :span="24">
        <div class="segment-label">补偿费</div>
        <div>
          <ElTable :data="tableData1" style="width: 100%; max-height: 300px" height="300">
            <ElTableColumn type="index" label="序号" align="center" width="100" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="payableAmount" label="应发" />
            <ElTableColumn prop="factAmount" label="已发" />
          </ElTable>
        </div>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="12">
        <div class="segment-label">补助费</div>
        <div>
          <ElTable :data="tableData2" style="width: 100%; max-height: 300px" height="300">
            <ElTableColumn type="index" label="序号" align="center" width="100" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="payableAmount" label="应发" />
            <ElTableColumn prop="factAmount" label="已发" />
          </ElTable>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="segment-label">奖励费</div>
        <div>
          <ElTable :data="tableData3" style="width: 100%; max-height: 300px" height="300">
            <ElTableColumn type="index" label="序号" align="center" width="100" />
            <ElTableColumn prop="name" label="名称" show-overflow-tooltip />
            <ElTableColumn prop="payableAmount" label="应发" />
            <ElTableColumn prop="factAmount" label="已发" />
          </ElTable>
        </div>
      </ElCol>
    </ElRow>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElTable, ElTableColumn, ElRow, ElCol } from 'element-plus'
import { ref, watch } from 'vue'
import { getFundIndividualDetailApi } from '@/api/fundReport/service'
const emit = defineEmits(['close', 'updateDistrict'])
const dialogLoading = ref<boolean>()

interface PropsType {
  show: any
  doorNo: string
  type: string
}

const props = defineProps<PropsType>()
const tableData1 = ref<any[]>([])
const tableData2 = ref<any[]>([])
const tableData3 = ref<any[]>([])

watch(
  () => props.show,
  (val) => {
    if (val) {
      requestDetailApi()
    }
  }
)

const requestDetailApi = async () => {
  dialogLoading.value = true
  const params = {
    doorNo: props.doorNo,
    type: props.type
  }
  try {
    const result = await getFundIndividualDetailApi(params)
    console.log('PKLL', result)
    tableData1.value = result.bcFeeList
    tableData2.value = result.bzFeeList
    tableData3.value = result.jlFeeList
    dialogLoading.value = false
  } catch {
    dialogLoading.value = false
  }
}

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
