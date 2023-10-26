<template>
  <WorkContentWrap>
    <!-- 企业/个体工商户 设备设施评估 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-end pb-12px">
        <ElSpace>
          <ElButton type="primary" :icon="EscalationIcon" @click="onReportData">
            填报完成
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
        <ElTableColumn label="项目" :width="150" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.name" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="规格" :width="180" prop="size" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.size">
              <ElOption
                v-for="item in dictObj[267]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="单位" :width="160" prop="unit" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.unit">
              <ElOption
                v-for="item in dictObj[268]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" :width="180" prop="number" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.number" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="用途"
          :width="180"
          prop="purpose"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.purpose">
              <ElOption
                v-for="item in dictObj[265]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="建造/购置年月"
          :width="180"
          prop="year"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElDatePicker v-model="row.year" type="month" placeholder="请选择" class="!w-full" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="原值(万元)"
          :width="180"
          prop="amount"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.amount" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="搬迁方式"
          :width="160"
          prop="moveType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.moveType">
              <ElOption
                v-for="item in dictObj[221]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="评估单价"
          :width="180"
          prop="valuationPrice"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.valuationPrice" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="成新率"
          :width="180"
          prop="newnessRate"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.newnessRate" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="评估金额(元)"
          :width="180"
          prop="valuationAmount"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.valuationAmount" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="补偿金额(元)"
          :width="180"
          prop="compensationAmount"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.compensationAmount" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="新增原因"
          :width="180"
          prop="addReason"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.addReason" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="备注"
          :width="180"
          prop="valuationRemark"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.valuationRemark" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" prop="action">
          <template #default="{ row }">
            <span class="btn-txt" @click="onDelRow(row)"> 删除 </span>
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInputNumber,
  ElInput,
  ElDatePicker,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
  ElFormItem
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getEquipmentListApi,
  saveEquipmentApi,
  deleteEquipmentApi
} from '@/api/AssetEvaluation/equipment-service'
import { saveImmigrantFillingApi } from '@/api/AssetEvaluation/service'

interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

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
  name: '', // 项目名称
  size: '', // 规格
  unit: '', // 单位
  number: 0, // 数量
  purpose: '', // 用途
  year: '', // 建造/购置年月
  amount: 0, // 原值
  moveType: '', // 搬迁方式
  valuationPrice: 0, // 评估单价(万元)
  newnessRate: 0, // 成新率
  valuationAmount: 0, // 评估金额
  compensationAmount: 0, // 补偿金额(万元)
  addReason: '', // 新增原因
  valuationRemark: '' // 评估备注
}

// 填报完成
const onReportData = async () => {
  const result = await saveImmigrantFillingApi({
    doorNo: props.doorNo,
    deviceStatus: '1'
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
  getEquipmentListApi(params).then((res) => {
    tableData.value = res.content
  })
}

// 删除
const onDelRow = (row) => {
  if (row.id) {
    rowItem = row
    dialogVisible.value = true
  } else {
    tableData.value.splice(tableData.value.indexOf(row), 1)
  }
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
    await deleteEquipmentApi(params.id)
    btnLoading.value = false
    getList()
    emit('updateData')
    ElMessage.success('删除成功')
    handleClose()
  } catch (error) {
    btnLoading.value = false
  }
}

// 保存
const onSave = () => {
  saveEquipmentApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

const handleClose = () => {
  deleteReason.value = ''
  dialogVisible.value = false
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
