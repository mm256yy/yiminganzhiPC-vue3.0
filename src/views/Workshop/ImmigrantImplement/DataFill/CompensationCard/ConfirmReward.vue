<template>
  <ElDialog
    title="奖励费确认"
    :model-value="props.show"
    :width="1200"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElTable :data="tableData" v-loading="loading" border style="width: 100%">
      <ElTableColumn label="指标名称" prop="name" align="center" header-align="center" />
      <ElTableColumn label="单位" width="100" prop="unit" align="center" header-align="center">
        <template #default="{ row }">
          {{ row.unit ? row.unit : '——' }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="数量" prop="number" align="center" header-align="center">
        <template #default="{ row }">
          <ElInputNumber
            v-if="row.isUpdate === '1' && row.isVerify !== '1' && showInput(row.name)"
            :min="0"
            v-model="row.number"
          />
          <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.number }}</div>
          <div v-if="row.isUpdate !== '1' || !showInput(row.name)"> —— </div>
        </template>
        <!-- <template #default="{ row }">
          <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.number }}</div>
          <div v-if="row.isUpdate !== '1' || !showInput(row.name)"> —— </div>
        </template> -->
      </ElTableColumn>
      <ElTableColumn label="补偿单价" prop="price" align="center" header-align="center">
        <template #default="{ row }">
          <ElInputNumber
            v-if="row.isUpdate === '1' && row.isVerify !== '1' && showInput(row.name)"
            :min="0"
            v-model="row.price"
            :precision="2"
          />
          <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.price }}</div>
          <div v-if="row.isUpdate !== '1' || !showInput(row.name)"> —— </div>
        </template>
        <!-- <template #default="{ row }">
          {{ row.price ? row.number : '——' }}
          <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.price }}</div>
          <div v-if="row.isUpdate !== '1' || !showInput(row.name)"> —— </div>
        </template> -->
      </ElTableColumn>
      <ElTableColumn
        label="补偿金额"
        width="100"
        prop="totalPrice"
        align="center"
        header-align="center"
      >
        <template #default="{ row }">
          <!-- <div v-if="row.isUpdate === '0'">{{ row.totalPrice }}</div>
          <div v-else-if="row.isUpdate === '1'">{{ computedTotalPrice(row) }}</div>
          <div v-else-if="row.isUpdate === '2'"> {{ getSummaries(row) }} </div> -->
          <div v-if="row.name !== '奖励费小计'">{{ computedTotalPrice(row) }}</div>
          <div v-else>{{ getSummaries(row) }}</div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
        <template #default="{ row }">
          <ElInput
            v-if="row.isUpdate === '1' && row.isVerify !== '1' && showInput(row.name)"
            placeholder="请输入"
            v-model="row.remark"
          />
          <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.remark }}</div>
          <div v-if="!showInput(row.name)"> —— </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="180" align="center" header-align="center" fixed="right">
        <template #default="{ row }">
          <ElButton v-if="row.isVerify !== '1'" type="primary" @click="onSave(row, '0')">
            保存
          </ElButton>
          <ElButton v-if="row.isVerify !== '1'" type="primary" @click="onSave(row, '1')">
            确认
          </ElButton>
          <div v-if="row.isVerify === '1'">已确认</div>
        </template>
      </ElTableColumn>
    </ElTable>
  </ElDialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  ElDialog,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElButton,
  ElInputNumber,
  ElInput
} from 'element-plus'
import { getCompensationCardList, saveRewardFee } from '@/api/immigrantImplement/createCard/service'
import { onMounted } from 'vue'

interface PropsType {
  show: boolean
  doorNo: string
}

const props = defineProps<PropsType>()
const tableData = ref<any[]>([])
const loading = ref<boolean>(false)
const emit = defineEmits(['close'])

const initData = () => {
  getCompensationCardList(props.doorNo).then((res: any) => {
    if (res && res.length) {
      tableData.value = res.filter(
        (item: any) => item.isUpdate == '1' && item.phType == 'LandNoMove'
      )
    }
    loading.value = false
  })
}

/**
 * 计算补偿金额
 * 补偿金额 = 数量 * 单价
 * @param row 当前行数据
 */
const computedTotalPrice = (row: any) => {
  if (row.totalPrice) {
    return Number(row.totalPrice)
  } else {
    if (row.number && row.price) {
      return Number(row.number) * Number(row.price)
    } else {
      return 0
    }
  }
}

/**
 * 获取奖励小计
 * @param row 当前行信息
 */

const getSummaries = (row: any) => {
  let sums = 0
  let sumIndex = 0
  tableData.value.forEach((column, index) => {
    if (column.name === row.name) {
      sumIndex = index
    }
  })
  const arr = tableData.value.filter((item, index) => item && index !== sumIndex)
  sums = arr.reduce((totalPrice, currentItem) => {
    return totalPrice + computedTotalPrice(currentItem)
  }, 0)
  return sums
}

// 关闭弹窗
const onClose = () => {
  emit('close')
}

/**
 * 保存/确认
 * @param data 当前行数据
 */
const onSave = (data: any, isVerify: string) => {
  loading.value = true
  // const totalPrice = Number(data.number) * Number(data.price)

  let params = {
    ...data,
    doorNo: props.doorNo,
    // totalPrice,
    isVerify
  }
  saveRewardFee(params)
    .then((res: any) => {
      if (res) {
        ElMessage.success('操作成功')
        initData()
      }
    })
    .catch(() => {
      loading.value = false
    })
}
//如果不为奖励费小计就展示输入框
const showInput = (name) => name !== '奖励费小计'

// 确认

onMounted(() => {
  initData()
})
</script>
