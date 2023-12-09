<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div>
          土地基本情况评估合计：
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
          label="组别"
          :width="150"
          prop="groupName"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.groupName" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="地块编号"
          :width="150"
          prop="landName"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.landName" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="所在位置"
          :width="120"
          prop="locationType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.locationType">
              <ElOption
                v-for="item in dictObj[326]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn
          label="种植户"
          :width="150"
          prop="growers"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.growers" />
          </template>
        </ElTableColumn> -->
        <ElTableColumn
          label="地块面积(亩)"
          :width="180"
          prop="landArea"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.landArea" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="地类"
          :width="200"
          prop="landType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElCascader class="!w-full" v-model="row.landType" :options="landTypeOptions" />
            <!-- <ElSelect clearable placeholder="请选择" v-model="row.landType">
              <ElOption
                v-for="item in dictObj[233]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> -->
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="土地性质"
          :width="200"
          prop="landNature"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.landNature">
              <ElOption
                v-for="item in dictObj[222]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="土地权属"
          :width="180"
          prop="landOwner"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.landOwner" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="获得方式"
          :width="160"
          prop="getType"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.getType" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="地块位置"
          :width="180"
          prop="landSea"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.landSea" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="评估单价(亩)"
          :width="180"
          prop="valuationPrice"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.valuationPrice" :precision="2" />
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
  ElMessage,
  ElCascader
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getLandBasicInfoListApi,
  saveLandBasicInfoApi,
  deleteLandBasicInfoApi
} from '@/api/AssetEvaluation/landBasicInfo-service'
import { saveImmigrantFillingApi } from '@/api/AssetEvaluation/service'
import { getDictByName } from '@/api/workshop/population/service'

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
const landTypeOptions = ref<any>([]) // 地类选项

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
  groupName: '',
  landName: '',
  locationType: '',
  growers: '',
  landArea: 0,
  landType: '',
  landNature: '',
  landOwner: '',
  getType: '',
  landSea: '',
  valuationPrice: 0,
  valuationAmount: 0,
  compensationAmount: 0,
  addReason: '',
  remark: ''
}

// 填报完成
const onReportData = async () => {
  const result = await saveImmigrantFillingApi({
    doorNo: props.doorNo,
    landStatus: '1'
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
  const params = {
    ...defaultRow
  }
  console.log('UOP', params)
  tableData.value.push(params)
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
  getLandBasicInfoListApi(params).then((res) => {
    tableData.value = res.content
  })
}

// 获取地类选项列表
const getLandTypeOptions = () => {
  getDictByName('土地类型').then((res: any) => {
    landTypeOptions.value = res
    console.log('土地类型', res)
  })
}
// 自动计算评估金额
const getModelValue = (row: any) => {
  const totalPrice = Number(row.valuationPrice) * Number(row.landArea)
  return totalPrice
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
    await deleteLandBasicInfoApi(params.id)
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
  const tableList = tableData.value.map((item) => {
    return {
      ...item,
      landType: item.landType ? JSON.stringify(item.landType) : ''
    }
  })
  saveLandBasicInfoApi(tableList).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

onMounted(() => {
  getList()
  getLandTypeOptions()
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
