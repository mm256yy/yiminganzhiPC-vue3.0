<template>
  <WorkContentWrap>
    <!-- 房屋装修评估 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div>
          房屋装修评估合计：
          <span class="text-[#1C5DF1]"> {{ total() }}</span>
          （元）
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
          label="幢号"
          :width="100"
          prop="houseNo"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.houseNo" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="类别"
          :width="120"
          prop="fitUpType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.fitUpType">
              <ElOption
                v-for="item in dictObj[323]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="名称"
          :width="150"
          prop="fitUpName"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.fitUpName" />
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
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.number" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="单价" :width="180" prop="price" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.price" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="折率"
          :width="180"
          prop="discountRate"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.discountRate" :precision="2" />
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
            <ElInputNumber :min="0" :model-value="getModelValue(scope.row)" :precision="2" />
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElDialog,
  ElFormItem,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getHouseDecorationListApi,
  saveHouseDecorationApi,
  deleteHouseDecorationApi
} from '@/api/AssetEvaluation/houseDecoration-service'
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
  houseNo: '',
  fitUpType: '',
  fitUpName: '',
  unit: '',
  number: 0,
  price: 0,
  discountRate: 0,
  valuationAmount: 0,
  compensationAmount: 0,
  addReason: '',
  remark: ''
}

// 填报完成
const onReportData = async () => {
  const result = await saveImmigrantFillingApi({
    doorNo: props.doorNo,
    houseRenovationStatus: '1'
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
  getHouseDecorationListApi(params).then((res) => {
    tableData.value = res.content
  })
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
    await deleteHouseDecorationApi(params.id)
    btnLoading.value = false
    getList()
    emit('updateData')
    ElMessage.success('删除成功')
    dialogVisible.value = false
  } catch (error) {
    btnLoading.value = false
  }
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
  saveHouseDecorationApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

// 自动计算评估金额
const getModelValue = (row: any) => {
  const totalPrice = Number(row.number) * Number(row.price) * Number(row.discountRate)
  return totalPrice
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
