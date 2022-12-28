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
          <ElButton :icon="printIcon" type="default" @click="() => {}">打印表格</ElButton>
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="品质名称" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入品质名称" v-if="row.isAdd" v-model="row.name" />
            <div v-else>
              {{ row.name }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="用途" prop="usageType" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入用途" v-if="row.isAdd" v-model="row.usageType" />
            <div v-else>
              {{ row.usageType }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="规格" prop="size" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入规格" v-if="row.isAdd" v-model="row.size" />
            <div v-else>
              {{ row.size }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="单位" prop="unit" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入单位" v-if="row.isAdd" v-model="row.unit" />
            <div v-else>
              {{ row.unit }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" prop="number" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber v-model="scope.row.number" />
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
import { ElButton, ElInputNumber, ElInput, ElSpace, ElTable, ElTableColumn } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getFruitwoodListApi } from '@/api/workshop/datafill/fruitwood-service'

const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
const tableData = ref<any[]>([])

const defaultRow = {
  doorNo: '',
  householdId: 0,
  name: '',
  usageType: '',
  size: '',
  unit: '',
  number: 0,
  remark: '',
  isAdd: true
}

const getList = () => {
  const params: any = {
    doorNo: '3333',
    householdId: ''
  }
  getFruitwoodListApi(params).then((res) => {
    console.log(res.content, 'res')
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
}
</script>
