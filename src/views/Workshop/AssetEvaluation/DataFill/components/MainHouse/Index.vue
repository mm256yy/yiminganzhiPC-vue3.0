<template>
  <WorkContentWrap>
    <!-- 房屋主体评估 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div>
          房屋主体评估合计：
          <span class="text-[#1C5DF1]"> {{ total() }}</span> （元）
        </div>
        <div class="flex items-center" style="color: red">
          *若需修改房屋基础信息，请联系指挥部工作人员
        </div>
        <ElSpace>
          <ElButton type="primary" :icon="EscalationIcon" @click="onReportData">
            评估完成
          </ElButton>
          <!-- <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton> -->
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
            <ElInput placeholder="请输入" v-model="scope.row.houseNo" :disabled="true" />
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn
          label="是否需要评估"
          :width="120"
          prop="hasEstimate"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.hasEstimate">
              <ElOption
                v-for="item in dictObj[362]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn> -->
        <ElTableColumn
          label="房屋坐落"
          :width="120"
          prop="situated"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.situated" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="房屋类别"
          :width="160"
          prop="houseType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.houseType">
              <ElOption
                v-for="item in dictObj[266]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="结构类型"
          :width="120"
          prop="constructionType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              placeholder="请选择"
              v-model="row.constructionType"
              :disabled="true"
            >
              <ElOption
                v-for="item in dictObj[252]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="层数(层)"
          :width="180"
          prop="storeyNumber"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.storeyNumber" :disabled="true" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="建筑面积(㎡)"
          :width="180"
          prop="landArea"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber
              :min="0"
              @change="getModelValue(scope.row)"
              v-model="scope.row.landArea"
              :precision="2"
              :disabled="true"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="竣工年月"
          :width="180"
          prop="completedTime"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElDatePicker
              class="!w-full"
              v-model="scope.row.completedTime"
              type="month"
              placeholder="请选择日期"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="房屋高程(m)"
          :width="180"
          prop="houseHeight"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.houseHeight" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="宅基地面积(㎡)"
          :width="180"
          prop="homesteadArea"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.homesteadArea" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="房屋所有权证编号"
          :width="150"
          prop="propertyNo"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.propertyNo" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="土地使用权证编号"
          :width="150"
          prop="landNo"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.landNo" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="结构等级"
          :width="120"
          prop="constructionLevel"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.constructionLevel">
              <ElOption
                v-for="item in dictObj[223]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="房屋高度(m)"
          :width="180"
          prop="buildingHeight"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.buildingHeight" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="成新率"
          :width="180"
          prop="newnessRate"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber
              :min="0"
              @change="getModelValue(scope.row)"
              v-model="scope.row.newnessRate"
              :precision="2"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="评估单价(元/㎡)"
          :width="180"
          prop="valuationPrice"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber
              :min="0"
              @change="getModelValue(scope.row)"
              v-model="scope.row.valuationPrice"
              :precision="2"
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
            <ElInputNumber :min="0" v-model="scope.row.valuationAmount" :precision="2" disabled />
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
        <ElTableColumn label="备注" :width="180" prop="remark" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.remark" />
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn
          label="宅基地面积"
          :width="160"
          prop="homesteadArea"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.homesteadArea" :disabled="true" />
          </template>
        </ElTableColumn> -->
        <ElTableColumn
          label="占地面积(㎡)"
          :width="180"
          prop="occupyArea"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.occupyArea" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="是否合法"
          :width="160"
          prop="houseType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.isCompliance" :disabled="true">
              <ElOption
                v-for="item in dictObj[371]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" prop="action" fixed="right">
          <template #default="scope">
            <span class="btn-txt" @click="onDelRow(scope.row)"> 删除 </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
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
  ElDatePicker,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getMainHouseListApi,
  saveMainHouseApi,
  deleteMainHouseApi
} from '@/api/AssetEvaluation/mainHouse-service'
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

// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const EscalationIcon = useIcon({ icon: 'carbon:send-alt' })
const tableData = ref<any[]>([])
const reportDialog = ref<boolean>(false)
const reportResult = ref<string[]>([])
const emit = defineEmits(['updateData'])

// 填报完成
const onReportData = async () => {
  const result = await saveImmigrantFillingApi({
    doorNo: props.doorNo,
    houseMainStatus: '1'
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
// const onAddRow = () => {
//   tableData.value.push({ ...defaultRow })
// }

// 获取列表数据
const getList = () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    projectId: props.projectId,
    status: 'implementation',
    size: 1000
  }
  getMainHouseListApi(params).then((res) => {
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

// 删除
const onDelRow = (row) => {
  if (row.id) {
    ElMessageBox.confirm('确认要删除该信息吗？', '警告', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    })
      .then(async () => {
        await deleteMainHouseApi(row.id)
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
  saveMainHouseApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

// 自动计算评估金额
const getModelValue = (row: any) => {
  const totalPrice =
    Number(row.landArea) *
    Number(row.valuationPrice) *
    (Number(row.newnessRate) == 0 ? 1 : Number(row.newnessRate))
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
