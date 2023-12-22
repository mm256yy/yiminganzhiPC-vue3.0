<template>
  <WorkContentWrap>
    <!-- 小型专项及农副业设施评估 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div>
          设备设施评估费：
          <span class="text-[#1C5DF1]"> {{ total() }}</span> （元）
        </div>
        <ElSpace>
          <ElButton type="primary" :icon="EscalationIcon" @click="onReportData">
            评估完成
          </ElButton>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn
          label="设施编号"
          :width="150"
          prop="facilitiesCode"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.facilitiesCode" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="设施类别"
          :width="150"
          prop="facilitiesType"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.facilitiesType" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="设施名称"
          :width="150"
          prop="facilitiesName"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.facilitiesName" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="单位" :width="150" prop="unit" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.unit" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" :width="150" prop="number" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber
              :min="0"
              @change="getValuationAmount(scope.row)"
              v-model="scope.row.number"
              :precision="2"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="单价" :width="150" prop="price" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber
              :min="0"
              @change="getValuationAmount(scope.row)"
              v-model="scope.row.price"
              :precision="2"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="成新率"
          :width="150"
          prop="newnessRate"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput
              placeholder="请输入"
              @change="getValuationAmount(scope.row)"
              v-model="scope.row.newnessRate"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="评估金额(元)"
          :width="180"
          prop="valuationAmount"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.valuationAmount" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="补偿金额(元)"
          :width="180"
          prop="compensationAmount"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.compensationAmount" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="新增原因"
          :width="180"
          prop="addReason"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.addReason" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="备注"
          :width="180"
          prop="valuationRemark"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.valuationRemark" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" prop="action" fixed="right">
          <template #default="scope">
            <span class="btn-txt" @click="onDelRow(scope.row)"> 删除 </span>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElDialog title="提示" :width="500" v-model="dialogVisible">
        <div class="title-hint"> 是否删除该条记录 </div>
        <ElFormItem label="删除原因" prop="reason">
          <ElInput v-model="deleteReason" placeholder="请输入删除原因" />
        </ElFormItem>
        <template #footer>
          <ElButton @click="handleClose">取消</ElButton>
          <ElButton type="primary" :loading="btnLoading" @click="onDeleteSubmit">确认</ElButton>
        </template>
      </ElDialog>
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessageBox,
  ElMessage,
  ElDialog,
  ElFormItem
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getSpecialEquipmentListApi,
  saveSpecialEquipmentApi,
  deleteSpecialEquipmentApi
} from '@/api/AssetEvaluation/specialEquipment-service'
import { saveImmigrantFillingApi } from '@/api/AssetEvaluation/service'

interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
  baseInfo: any
}

const props = defineProps<PropsType>()

const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const EscalationIcon = useIcon({ icon: 'carbon:send-alt' })
const tableData = ref<any[]>([])
const reportDialog = ref<boolean>(false)
const reportResult = ref<string[]>([])
const emit = defineEmits(['updateData'])
const dialogVisible = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const deleteReason = ref('') // 删除原因
let rowItem = reactive({ id: '' }) // 行信息

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  status: 'implementation',
  facilitiesCode: '', // 设施编号
  facilitiesType: '', // 设施类别
  facilitiesName: '', // 设施名称
  unit: '', // 单位
  number: 0, // 数量
  price: 0, // 单价
  newnessRate: '', // 成新率
  valuationAmount: 0, // 评估金额
  compensationAmount: 0, // 补偿金额
  valuationRemark: '', // 备注
  addReason: '' // 新增原因
}

// 填报完成
const onReportData = async () => {
  const result = await saveImmigrantFillingApi({
    doorNo: props.doorNo,
    specialStatus: '1'
  })
  if (result && Array.isArray(result)) {
    reportDialog.value = true
    reportResult.value = result
  } else {
    ElMessage.success('填报成功！')
    emit('updateData')
  }
}

// 添加行
const onAddRow = () => {
  tableData.value.push({ ...defaultRow })
}

// 获取列表数据
const getList = () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    projectId: props.projectId,
    status: 'implementation',
    size: 1000
  }
  getSpecialEquipmentListApi(params).then((res) => {
    tableData.value = res.content
  })
}

// 房屋主体评估合计
const total = () => {
  let sum = 0
  if (tableData.value && tableData.value.length) {
    tableData.value.map((item: any) => {
      if (item.compensationAmount > 0) {
        sum += item.compensationAmount
      }
    })
  }
  return sum.toFixed(2)
}

const onDeleteSubmit = async () => {
  if (!deleteReason.value) {
    ElMessage.error('删除原因不能为空')
    return
  }

  const params = {
    ...rowItem,
    deleteReason: deleteReason.value
  }

  btnLoading.value = true
  try {
    await deleteSpecialEquipmentApi(params.id)
    btnLoading.value = false
    getList()
    emit('updateData')
    ElMessage.success('删除成功')
    dialogVisible.value = false
  } catch (error) {
    btnLoading.value = false
  }
}

// 删除
const onDelRow = (row) => {
  if (row.id) {
    ElMessageBox.confirm('确认要删除该信息吗？', '警告', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    })
      .then(async () => {
        await deleteSpecialEquipmentApi(row.id)
        getList()
        emit('updateData')
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  } else {
    tableData.value.splice(tableData.value.indexOf(row), 1)
  }
}

// 保存
const onSave = () => {
  saveSpecialEquipmentApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

const handleClose = () => {
  deleteReason.value = ''
  dialogVisible.value = false
}
//自动计算评估金额
const getValuationAmount = (row: any) => {
  let totalPrice = Number(row.number) * Number(row.price) * Number(row.newnessRate)
  row.valuationAmount = totalPrice
  row.compensationAmount = totalPrice
}
let handelchange = (e: any, row) => {
  row.compensationAmount = e
}
onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
.btn-txt {
  color: red;
  cursor: pointer;
}
</style>
