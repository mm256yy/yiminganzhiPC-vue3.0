<template>
  <!-- 设施设备信息 -->
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
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
        <ElTableColumn label="名称" :width="160" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.name" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="规格型号"
          :width="160"
          prop="size"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.size" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" :width="175" prop="number" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.number" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="单位" :width="160" prop="unit" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.unit">
              <ElOption
                v-for="item in dictObj[268]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>

        <ElTableColumn
          label="用途"
          :width="160"
          prop="purpose"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.purpose" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="建造/购置年份"
          :width="180"
          prop="year"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElDatePicker v-model="row.year" type="year" placeholder="选择年份" class="!w-full" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="原值(万元)"
          :width="175"
          prop="amount"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.amount" :precision="2" />
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
            <ElSelect clearable filterable placeholder="请选择" v-model="row.moveType">
              <ElOption
                v-for="item in dictObj[221]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" :width="180" prop="remark" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入" v-model="scope.row.remark" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" prop="action">
          <template #default="scope">
            <span @click="onDelRow(scope.row)" :style="{ color: 'red', cursor: 'pointer' }">
              删除
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, computed } from 'vue'
import {
  ElButton,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElMessageBox
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getDeviceListApi,
  saveDeviceListApi,
  deleteDeviceApi
} from '@/api/workshop/datafill/device-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { globalData } from '@/config/fill'

interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])

const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  name: '',
  size: '',
  unit: '',
  number: 0,
  purpose: '',
  year: '',
  amount: 0,
  moveType: '',
  remark: ''
}

const onDelRow = (row) => {
  ElMessageBox.confirm('确认要删除该信息吗？', '警告', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
    .then(async () => {
      if (row.id) {
        await deleteDeviceApi(row.id)
        getList()
      } else {
        tableData.value.splice(tableData.value.indexOf(row), 1)
      }

      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const getList = () => {
  const params = {
    doorNo: props.doorNo,
    householdId: +props.householdId,
    size: 1000
  }
  getDeviceListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
  tableData.value.push({ ...defaultRow })
}

const onSave = () => {
  let params: any = []
  if (tableData.value && tableData.value.length) {
    tableData.value.map((item: any) => {
      params.push({
        ...item,
        status: globalData.currentSurveyStatus
      })
    })
  }
  saveDeviceListApi(params).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}
</script>
