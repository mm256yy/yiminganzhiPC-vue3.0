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
        <ElTableColumn label="穴位" prop="graveType" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect v-model="row.graveType">
              <ElOption value="1" label="单穴" />
              <ElOption value="2" label="双穴" />
              <ElOption value="3" label="多穴" />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" prop="number" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber :min="0" placeholder="请输入数量" v-model="row.number" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="材料" prop="materials" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入材料" v-model="row.materials" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="立坟年份" prop="graveYear" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput v-model="row.graveYear" placeholder="请输入年份">
              <template #append>年</template>
            </ElInput>
          </template>
        </ElTableColumn>
        <ElTableColumn label="所处位置" prop="gravePosition" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput v-model="row.gravePosition" placeholder="请输入所处位置" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入内容" v-model="row.remark" />
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
  graveType: '',
  materials: '',
  graveYear: '',
  gravePosition: '',
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
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
  tableData.value.push(defaultRow)
}

const onSave = () => {
  saveGraveListApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
  })
}
</script>
