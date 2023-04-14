<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div>
          房屋附属设施评估合计：
          <span class="text-[#1C5DF1]"> {{ total() }}</span>
          （元）
        </div>
        <ElSpace>
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
        <!-- 字段未定 -->
        <ElTableColumn
          label="项目"
          :width="150"
          prop="project"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.project" />
          </template>
        </ElTableColumn>
        <!-- 字段未定 -->
        <ElTableColumn label="规格" :width="180" prop="spec" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.spec">
              <ElOption
                v-for="item in dictObj[267]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <!-- 字段未定 -->
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
        <!-- 字段未定 -->
        <ElTableColumn
          label="数量"
          :width="180"
          prop="quantity"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.quantity" :precision="2" />
          </template>
        </ElTableColumn>
        <!-- 字段未定 -->
        <ElTableColumn label="单价" :width="180" prop="price" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.price" :precision="2" />
          </template>
        </ElTableColumn>
        <!-- 字段未定 -->
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
        <!-- 字段未定 -->
        <ElTableColumn
          label="评估金额(元)"
          :width="180"
          prop="evaluationAmount"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.evaluationAmount" :precision="2" />
          </template>
        </ElTableColumn>
        <!-- 字段未定 -->180
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
        <ElTableColumn label="操作" prop="action">
          <template #default="scope">
            <span class="btn-txt" @click="onDelRow(scope.row)"> 删除 </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
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
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { onMounted } from 'vue'

interface PropsType {
  doorNo: string
  householdId: string
}

const props = defineProps<PropsType>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  project: '',
  spec: '',
  unit: '',
  quantity: 0,
  price: 0,
  discountRate: 0,
  evaluationAmount: 0,
  compensationAmount: 0,
  remark: ''
}

// 添加行
const onAddRow = () => {
  tableData.value.push({ ...defaultRow })
}

// 获取列表数据
const getList = () => {
  // const params = {
  //   doorNo: props.doorNo,
  //   householdId: +props.householdId,
  //   size: 1000
  // }
  // getFruitwoodListApi(params).then((res) => {
  //   tableData.value = res.content
  // })
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
        // await deleteFruitwoodListApi(row.id)
        getList()

        ElMessage.success('删除成功')
      })
      .catch(() => {})
  } else {
    tableData.value.splice(tableData.value.indexOf(row), 1)
  }
}

// 保存
const onSave = () => {}

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
