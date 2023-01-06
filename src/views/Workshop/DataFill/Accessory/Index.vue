<!-- 附属物 -->
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
        <ElTableColumn label="项目" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入项目" v-if="row.isAdd" v-model="row.name" />
            <div v-else>
              {{ row.name }}
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
            <ElInputNumber :min="0" v-model="scope.row.number" />
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
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessage
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getAccessoryListApi,
  saveAccessoryListApi,
  getAppendantOptionApi
} from '@/api/workshop/datafill/accessory-service'

interface PropsType {
  householdId: number
  doorNo: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
const tableData = ref<any[]>([])

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  name: '',
  size: '',
  unit: '',
  number: 0,
  remark: '',
  isAdd: true
}

const getAppendantOption = async () => {
  const info = await getAppendantOptionApi()
  return info.content || []
}

const getList = async () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    size: 1000
  }
  const res = await getAccessoryListApi(params)
  if (res && res.content && res.content.length) {
    tableData.value = res.content
  } else {
    // 使用默认的配置
    const defaultList = await getAppendantOption()
    tableData.value = defaultList.map((item) => {
      const { id, ...ret } = item
      const newItem = {
        ...ret
      }
      newItem.doorNo = props.doorNo
      newItem.householdId = props.householdId
      newItem.surveyId = id + ''
      newItem.number = 0
      newItem.remark = ''
      return newItem
    })
  }
}

getList()

const onAddRow = () => {
  tableData.value.push(defaultRow)
}

const onSave = () => {
  saveAccessoryListApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
  })
}
</script>
