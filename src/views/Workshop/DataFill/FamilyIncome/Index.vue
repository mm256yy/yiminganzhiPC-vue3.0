<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
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
      <ElTable :data="tableData" :span-method="spanMethod" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="" prop="type" align="center" header-align="center">
          <template #default="{ row }">
            <div>
              {{ row.type }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="收入项目" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <div>
              {{ row.name }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="金额" prop="amount" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入金额" v-model="row.amount" />
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
import { ElButton, ElInput, ElSpace, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getFamilyIncomeListApi,
  saveFamilyIncomeListApi
} from '@/api/workshop/datafill/family-service'
import { FamilyIncomeDtoType } from '@/api/workshop/datafill/family-types'

interface SpanMethodProps {
  row: FamilyIncomeDtoType
  column: any
  rowIndex: number
  columnIndex: number
}

interface PropsType {
  householdId: number
  doorNo: string
}

const props = defineProps<PropsType>()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
const tableData = ref<any[]>([])

const getList = () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    size: 100
  }
  getFamilyIncomeListApi(params).then((res) => {
    console.log(res.content, 'res')
    // tableData.value = res.content
    tableData.value = [
      {
        id: 0,
        doorNo: '',
        householdId: 0,
        sort: '',
        type: '1',
        name: '测试1',
        amount: 0,
        remark: ''
      },
      {
        id: 0,
        doorNo: '',
        householdId: 0,
        sort: '',
        type: '1',
        name: '测试2',
        amount: 0,
        remark: ''
      },
      {
        id: 0,
        doorNo: '',
        householdId: 0,
        sort: '',
        type: '1',
        name: '测试3',
        amount: 0,
        remark: ''
      },
      {
        id: 0,
        doorNo: '',
        householdId: 0,
        sort: '',
        type: '2',
        name: '测试1111',
        amount: 0,
        remark: ''
      },
      {
        id: 0,
        doorNo: '',
        householdId: 0,
        sort: '',
        type: '2',
        name: '测试2222',
        amount: 0,
        remark: ''
      }
    ]
  })
}

getList()

const spanMethod = ({ row, rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 1) {
    if (rowIndex !== 0 && row.type === tableData.value[rowIndex - 1].type) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
    const sameTypes = tableData.value.filter((item) => item.type === row.type)
    return {
      rowspan: sameTypes.length,
      colspan: 1
    }
  }
}

const onSave = () => {
  console.log(tableData.value, 'tabledata')
  saveFamilyIncomeListApi(tableData.value).then((res) => {
    console.log(res, 'res')
    ElMessage.success('操作成功！')
  })
}
</script>
