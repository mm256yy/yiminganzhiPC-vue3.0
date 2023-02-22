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
        </ElSpace>
      </div>
      <ElTable border :data="tableData" :span-method="spanMethod" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="分类" prop="type" align="center" header-align="center">
          <template #default="{ row }">
            <!-- <div v-if="row.subtotal" class="total-item">小计：{{ getSubtotal(row.type) }}</div>
            <div v-else-if="row.total" class="total-item">总计：{{ total }}</div>  v-else-->
            <div>
              {{ getTypeList2Lable(row.type) }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="收入项目" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <div v-else>
              {{ row.name }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="最近一年" prop="lastYearAmount" align="center" header-align="center">
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <ElInput
              v-else
              placeholder="请输入"
              type="number"
              min="0"
              v-model="row.lastYearAmount"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="最近二年"
          prop="lastTwoYearAmount"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <ElInput
              v-else
              placeholder="请输入"
              type="number"
              min="0"
              v-model="row.lastTwoYearAmount"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="最近三年"
          prop="lastThreeYearAmount"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <ElInput
              v-else
              placeholder="请输入"
              type="number"
              min="0"
              v-model="row.lastThreeYearAmount"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"></div>
            <div v-else-if="row.total" class="total-item"></div>
            <ElInput v-else placeholder="请输入内容" v-model="row.remark" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
// , computed
import { ref } from 'vue'
import { ElButton, ElInput, ElSpace, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getImmigrantManagement,
  saveImmigrantManagement,
  getFamilyIncomeOptionApi
} from '@/api/workshop/datafill/family-service'
import { useAppStore } from '@/store/modules/app'
// import { FamilyIncomeDtoType } from '@/api/workshop/datafill/family-types'

interface SpanMethodProps {
  row: any
  column: any
  rowIndex: number
  columnIndex: number
}

interface PropsType {
  householdId: string
  doorNo: string
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
const typeList2 = ref<any>([
  { label: '收入情况', value: 1 },
  { label: '工资情况', value: 2 },
  { label: '职工福利基金', value: 3 },
  { label: '工会经费', value: 4 },
  { label: '企业公积金', value: 5 },
  { label: '离休人员费用', value: 6 },
  { label: '上缴税收', value: 7 },
  { label: '企业留利', value: 8 },
  { label: '流动资产贷款', value: 9 },
  { label: '上交管理费', value: 10 },
  { label: '其他财务费用', value: 11 },
  { label: '其他', value: ' ' }
])
const getTypeList2Lable = (val) => {
  return typeList2.value.find((item) => item.value != ' ' && item.value == val)?.label
}
const getOption = async () => {
  console.log(appStore.getCurrentProjectId)

  const result = await getFamilyIncomeOptionApi({
    // projectId: appStore.getCurrentProjectId,
    configType: 'Company',
    size: 1000
  })
  result.content.forEach((item) => {
    for (const key in item) {
      key == 'id' && Reflect.deleteProperty(item, 'id')
    }
  })
  return result.content || []
}

const addSubtotal = (arr?: any[]) => {
  if (!arr || !arr.length) return []
  // 拿到所有的类型
  const types: string[] = []
  arr.forEach((item) => {
    if (types.indexOf(item.type) === -1) {
      types.push(item.type)
    }
  })

  cateTypes.value = types

  let mutArray: Array<any | TotalItemType>[] = []
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
  // mutArray.forEach((item, index) => {
  //   // 中间添加上小计
  //   if (index !== mutArray.length - 1) {
  //     const subItem: TotalItemType = {
  //       type: `subtotal-${types[index]}`,
  //       subtotal: true,
  //       total: false
  //     }
  //     item.push(subItem)
  //   } else {
  //     // 末尾添加上总计
  //     const totalItem: TotalItemType = {
  //       type: `total-${types[index]}`,
  //       subtotal: false,
  //       total: true
  //     }
  //     item.push(totalItem)
  //   }
  // })

  return mutArray.flat(Infinity) || []
}

const getList = async () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    configType: 'Company',
    size: 100
  }
  const res = await getImmigrantManagement(params)

  if (res && res.content && res.content.length) {
    tableData.value = addSubtotal(res.content)
  } else {
    const defaultList = await getOption()
    const baseList = defaultList.map((item) => {
      const newItem: any = {
        ...item,
        doorNo: props.doorNo,
        householdId: +props.householdId,

        remark: ''
      }
      return newItem
    })
    tableData.value = addSubtotal(baseList)
  }
  console.log(tableData.value)
}

getList()

const spanMethod = ({ row, rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 1) {
    if (rowIndex !== 0 && row.type === tableData.value[rowIndex - 1].type) {
      return {
        rowspan: 0,
        colspan: 1
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
// const getSubtotal = (type: string) => {
//   for (let typeItem of cateTypes.value) {
//     if (`subtotal-${typeItem}` === type) {
//       const tableList = tableData.value.filter((item) => item.type === typeItem)
//       const result = tableList.reduce((pre, current) => {
//         return pre + parseFloat(current.amount)
//       }, 0)
//       return result
//     }
//   }
// }

// // 总计
// const total = computed(() => {
//   const realTableData = tableData.value.filter((item) => !item.type.includes('total'))
//   return realTableData.reduce((pre, current) => {
//     return pre + parseFloat(current.amount)
//   }, 0)
// })

const onSave = () => {
  const realTableData = tableData.value.filter((item) => !item.type.includes('total'))
  saveImmigrantManagement(realTableData).then(() => {
    ElMessage.success('操作成功！')
    getList()
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
