<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace v-if="isEdit">
          <ElButton
            :icon="saveIcon"
            :loading="loading"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
          <ElButton @click="recordClick" v-if="surveyStatus === SurveyStatusEnum.Review">
            修改日志
          </ElButton>
        </ElSpace>
      </div>
      <ElTable border :data="tableData" :span-method="spanMethod" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="" :width="180" prop="type" align="center" header-align="center">
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item">
              小计：{{ getSubtotal(row.type).toFixed(2) }}
            </div>
            <div v-else-if="row.total" class="total-item">总计：{{ isNaN(total) ? 0 : total }}</div>
            <div v-else>
              {{
                row.type == 1
                  ? '第一产业收入'
                  : row.type == 2
                  ? '第二、三产业收入'
                  : row.type == 3
                  ? '其它'
                  : ''
              }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="收入项目"
          :width="283"
          prop="name"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <div v-else>
              {{ row.name }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="金额(万元)"
          :width="218"
          prop="amount"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <ElInput
              v-else
              placeholder="请输入金额"
              type="number"
              min="0"
              v-model="row.amount"
              :disabled="!isEdit"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </template>
        </ElTableColumn>

        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <ElInput v-else placeholder="请输入内容" v-model="row.remark" :disabled="!isEdit" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <RecordListDialog
      type="收入信息"
      :recordShow="recordShow"
      @close="recordClose"
      :doorNo="doorNo"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import RecordListDialog from '../components/RecordListDialog.vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, computed } from 'vue'
import { ElButton, ElInput, ElSpace, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getFamilyIncomeListApi,
  saveFamilyIncomeListApi,
  getFamilyIncomeOptionApi
} from '@/api/workshop/datafill/family-service'
import { useAppStore } from '@/store/modules/app'
import { FamilyIncomeDtoType } from '@/api/workshop/datafill/family-types'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

interface SpanMethodProps {
  row: FamilyIncomeDtoType
  column: any
  rowIndex: number
  columnIndex: number
}

interface PropsType {
  householdId: string
  doorNo: string
  surveyStatus: SurveyStatusEnum
  classifyType?: string // 角色分类类型
}

interface TotalItemType {
  type: string
  subtotal?: boolean
  total?: boolean
}

const props = defineProps<PropsType>()
const appStore = useAppStore()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const cateTypes = ref<string[]>([])
const recordShow = ref(false)
const loading = ref(false)

// 是否可编辑
const isEdit = computed(() => {
  return props.classifyType !== 'check'
})

const recordClose = () => {
  recordShow.value = false
}
const recordClick = () => {
  recordShow.value = true
}
const getOption = async () => {
  console.log(appStore.getCurrentProjectId)
  const result = await getFamilyIncomeOptionApi({
    // projectId: appStore.getCurrentProjectId,
    configType: 'PeasantHousehold',
    size: 1000
  })
  result.content.forEach((item) => {
    for (const key in item) {
      key == 'id' && Reflect.deleteProperty(item, 'id')
    }
  })
  return result.content || []
}

const addSubtotal = (arr?: FamilyIncomeDtoType[]) => {
  if (!arr || !arr.length) return []
  // 拿到所有的类型
  const types: string[] = []
  arr.forEach((item) => {
    if (types.indexOf(item.type) === -1) {
      types.push(item.type)
    }
  })

  cateTypes.value = types

  let mutArray: Array<FamilyIncomeDtoType | TotalItemType>[] = []
  // 根据type生成多个数组
  types.forEach((typeItem, typeIndex) => {
    arr.forEach((arrItem) => {
      if (arrItem.type === typeItem) {
        mutArray[typeIndex] = mutArray[typeIndex] || []
        mutArray[typeIndex].push(arrItem)
      }
    })
  })

  // 在分类数组中添加上 小计 和 总计
  mutArray.forEach((item, index) => {
    // 中间添加上小计
    if (index !== mutArray.length - 1) {
      const subItem: TotalItemType = {
        type: `subtotal-${types[index]}`,
        subtotal: true,
        total: false
      }
      item.push(subItem)
    } else {
      // 末尾添加上总计
      const totalItem: TotalItemType = {
        type: `total-${types[index]}`,
        subtotal: false,
        total: true
      }
      item.push(totalItem)
    }
  })

  return mutArray.flat(Infinity) || []
}

const getList = async () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    size: 100
  }
  const res = await getFamilyIncomeListApi(params)

  if (res && res.content && res.content.length) {
    tableData.value = addSubtotal(res.content)
  } else {
    const defaultList = await getOption()
    const baseList = defaultList.map((item) => {
      const newItem: FamilyIncomeDtoType = {
        ...item,
        doorNo: props.doorNo,
        householdId: +props.householdId,
        amount: 0,
        remark: ''
      }
      return newItem
    })
    tableData.value = addSubtotal(baseList)
  }
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

// 小计
const getSubtotal = (type: string) => {
  for (let typeItem of cateTypes.value) {
    if (`subtotal-${typeItem}` === type) {
      const tableList = tableData.value.filter((item) => item.type === typeItem)
      const result = tableList.reduce((pre, current) => {
        return pre + parseFloat(current.amount)
      }, 0)
      return isNaN(result) ? 0 : result
    }
  }
}

// 总计
const total = computed(() => {
  const realTableData = tableData.value.filter((item) => !item.type.includes('total'))
  return realTableData
    .reduce((pre, current) => {
      return (pre ? pre : 0) + (current.amount ? parseFloat(current.amount) : 0)
    }, 0)
    .toFixed(2)
})

const onSave = () => {
  const realTableData = tableData.value.filter((item) => !item.type.includes('total'))
  loading.value = true
  saveFamilyIncomeListApi(realTableData)
    .then(() => {
      ElMessage.success('操作成功！')
      loading.value = false
      getList()
    })
    .catch(() => {
      ElMessage.error('操作失败！')
      loading.value = false
    })
}
</script>

<style lang="less" scoped>
.total-item {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  background-color: #f6f6f6;
  align-items: center;
}
</style>
