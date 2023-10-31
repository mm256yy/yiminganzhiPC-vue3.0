<template>
  <ElDialog
    title="付款对象选择"
    :model-value="props.show"
    :width="1700"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <div v-if="props.type == true">
      <ElButton @click="addDemo" type="primary" style="float: right; margin-bottom: 10px"
        >添加</ElButton
      >
      <ElTable :data="tableDatas" style="width: 100%" class="mb-20" :border="true" row-key="id">
        <ElTableColumn
          label="序号"
          align="center"
          width="80"
          type="index"
          header-align="center"
          prop="index"
        />
        <ElTableColumn label="支付对象" align="center" prop="payObject" header-align="center">
          <template #default="{ row }">
            <ElSelect class="w-350px" v-model="row.contractId">
              <ElOption
                v-for="item in dictObj[393]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="申请金额" prop="contractName" align="center" header-align="center">
          <!-- <ElInputNumber class="!w-200px" /> -->
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.amount" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="操作"
          prop="contractName"
          align="center"
          header-align="center"
          width="80"
        >
          <template #default="{ row }">
            <ElButton @click="delDemo(row)" type="primary" style="float: right; margin-bottom: 10px"
              >删除</ElButton
            >
          </template>
        </ElTableColumn>
      </ElTable>

      <div>合计金额:{{ amountPrice }}元</div>
    </div>
    <ElTable
      :data="tableData"
      style="width: 100%"
      class="mb-20"
      :border="true"
      v-if="props.type == false"
    >
      <ElTableColumn label="序号" align="center" width="50" type="index" header-align="center" />
      <ElTableColumn label="专项名称" align="center" prop="projectName" header-align="center" />
      <ElTableColumn label="合同名称" prop="contractName" align="center" header-align="center" />
      <ElTableColumn label="合同编号" prop="contractCode" align="center" header-align="center" />
      <ElTableColumn label="合同乙方" prop="contractPartyB" align="center" header-align="center" />
      <ElTableColumn
        label="合同金额(万元)"
        prop="contractAmount"
        align="center"
        header-align="center"
      />
      <ElTableColumn label="支付节点" prop="paymentNode" align="center" header-align="center">
        <template #default="{ row }">
          <ElCheckboxGroup
            v-model="check"
            @change="
              (val) => {
                checkList(val, row, row.id)
              }
            "
          >
            <ElCheckbox
              :label="formatDate(item.paymentDate) + ' ' + '金额:' + item.amount + '元'"
              :value="item.id"
              v-for="(item, index) in row.nodeDtoList"
              :key="index"
              v-model="checkType"
            />
          </ElCheckboxGroup>
        </template>
      </ElTableColumn>
      <ElTableColumn label="申请金额" align="center" header-align="center">
        <template #default="{ row }">
          <ElInputNumber class="!w-200px" style="width: 50px" v-model="row.amount" />
        </template>
      </ElTableColumn>
    </ElTable>

    <template #footer>
      <ElButton @click="onClose(false)">取消</ElButton>
      <ElButton type="primary" @click="addSubmit(false)">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElDialog,
  ElButton,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElMessage,
  ElCheckboxGroup,
  ElCheckbox
} from 'element-plus'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getPaymentApplicationPpsList } from '@/api/fundManage/paymentApplication-service'
import { formatDate } from '@/utils/index'
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
interface PropsType {
  show: any
  type: any
}
// const formRef = ref<any>()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict', 'objlist', 'tableList'])
// const payObject = ref()
// 关闭弹窗
const onClose = (flag: boolean) => {
  emit('close', flag)
}
const addSubmit = (flag: boolean) => {
  emit('objlist', tableDatas.value)
  emit('tableList', tableObj.value)
  emit('close', flag)
}
const dataId = ref<number>(0)
const amountPrice = ref<number>(0)
const check = ref<any>()
const checkType = ref<boolean>()
const tableData = ref<any[]>([])
const tableObj = ref<any[]>([]) //付款对象集合
const vals = ref<any[]>([]) //付款对象ID
const checkList = (res: any, row: any, val: any) => {
  vals.value.push(val)
  console.log(val, row)

  tableObj.value.push({
    projectName: row.projectName,
    contractName: row.contractName,
    contractCode: row.contractCode,
    contractAmount: row.contractAmount,
    paymentNode: res,
    amount: row.amount,
    contractId: row.id,
    nodeIds: vals.value.join()
  })
  console.log(tableObj.value, '测试传递的数据')
}
const tableDatas = ref<any[]>([])
const addDemo = () => {
  const d = {
    index: dataId.value++,
    contractId: '',
    amount: ''
  }
  tableDatas.value.push(d)
  amountPrice.value = tableDatas.value.reduce((c, item) => c + item.amount * 1, 0)
  console.log(tableDatas.value, amountPrice.value, '打印传递的计算值')
}
const delDemo = (row: any) => {
  tableDatas.value.splice(row.index, 1)
  ElMessage.success('删除成功！')
}

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}
const ppsList = () => {
  getPaymentApplicationPpsList({ keywords: '1' }).then((res: any) => {
    if (res) {
      tableData.value = res
      console.log(tableData.value, '付款对象数据')
    }
  })
}

onMounted(() => {
  ppsList()
})
</script>

<style lang="less">
.el-checkbox:last-of-type {
  margin-right: 30px;
}

.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.red {
  color: #ff3939;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}
</style>
