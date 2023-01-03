<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
            >保存</ElButton
          >
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="穴位" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect v-model="row.name">
              <ElOption value="1" label="单穴" />
              <ElOption value="2" label="双穴" />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" prop="number" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber :min="0" placeholder="请输入数量" v-model="row.number" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="材料" prop="size" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入材料" v-model="row.size" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="立坟年份" prop="unit" align="center" header-align="center">
          <template #default="{ row }">
            <ElDatePicker v-model="row.unit" type="year" placeholder="Pick a year" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="所处位置" prop="address" align="center" header-align="center">
          <template #default="scope">
            <ElInput v-model="scope.row.address" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入内容" v-model="scope.row.remark" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import {
  ElButton,
  ElDatePicker,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getGraveListApi, saveGraveListApi } from '@/api/workshop/datafill/grave-service'
interface PropsType {
  householdId: number
  doorNo: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  name: '',
  usageType: '',
  size: '',
  unit: '',
  number: 0,
  remark: '',
  isAdd: true
}

const getList = () => {
  const params = {
    doorNo: props.doorNo,
    householdId: props.householdId
  }
  getGraveListApi(params).then((res) => {
    console.log(res.content, 'res')
    tableData.value = res.content
    tableData.value = [
      {
        id: 0,
        doorNo: 'string',
        householdId: 0,
        surveyId: 'string',
        name: '',
        usageType: '',
        size: '',
        unit: '',
        number: 0,
        remark: ''
      }
    ]
  })
}

getList()

const onAddRow = () => {
  tableData.value.push(defaultRow)
}

const onSave = () => {
  console.log(tableData.value, 'tabledata')
  saveGraveListApi(tableData.value).then((res) => {
    console.log(res, 'res')
    ElMessage.success('操作成功！')
  })
}
</script>
