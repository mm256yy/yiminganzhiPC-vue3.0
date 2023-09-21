<template>
  <WorkContentWrap>
    <!-- 土地青苗及附着物评估 (填报状态字段未定) -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div>
          土地青苗及附着物评估合计：
          <span class="text-[#1C5DF1]"> {{ total() }}</span> （元）
        </div>
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
        <ElTableColumn
          label="地块编号"
          :width="150"
          prop="landNumber"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.landNumber" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="名称" :width="150" prop="name" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.name" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="规格" :width="150" prop="size" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.size" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="数量(㎡)"
          :width="180"
          prop="number"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.number" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="单价(元/㎡)"
          :width="180"
          prop="price"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.price" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="费率" :width="180" prop="rate" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.rate" :precision="2" />
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
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.addReason" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" :width="180" prop="remark" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.remark" />
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
  ElDialog,
  ElFormItem,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getLandGreenSeedlingsListApi,
  saveLandGreenSeedlingsApi,
  deleteLandGreenSeedlingsApi
} from '@/api/AssetEvaluation/landGreenSeedlings-service'
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
let rowItem = reactive({ id: '' }) //

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  status: 'implementation',
  landNumber: '',
  name: '',
  size: '',
  number: 0,
  price: 0,
  rate: 0,
  valuationAmount: 0,
  compensationAmount: 0,
  addReason: '',
  remark: ''
}

// 填报完成
const onReportData = async () => {
  const result = await saveImmigrantFillingApi({
    doorNo: props.doorNo,
    landSeedlingStatus: '1'
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
  getLandGreenSeedlingsListApi(params).then((res) => {
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
    await deleteLandGreenSeedlingsApi(params.id)
    btnLoading.value = false
    getList()
    emit('updateData')
    ElMessage.success('删除成功')
    handleClose()
  } catch (error) {
    btnLoading.value = false
  }
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

const handleClose = () => {
  deleteReason.value = ''
  dialogVisible.value = false
}

// 保存
const onSave = () => {
  saveLandGreenSeedlingsApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
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

.title-hint {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}
</style>
