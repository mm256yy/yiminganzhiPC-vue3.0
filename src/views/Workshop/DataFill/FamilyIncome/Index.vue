<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
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
          <ElButton @click="recordClick" v-if="tabCurrentId == 2">修改日志</ElButton>
        </ElSpace>
      </div>
      <ElTable border :data="tableData" :span-method="spanMethod" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="" :width="180" prop="type" align="center" header-align="center">
          <template #default="{ row }">
            <div v-if="row.subtotal" class="total-item"
              >小计：{{ getSubtotal(row.type).toFixed(2) }}</div
            >
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
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
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

    <recordDialog :recordShow="recordShow" @close="recordClose" :doorNo="doorNo" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import recordDialog from '../components/recordDialog.vue'
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

interface SpanMethodProps {
  row: FamilyIncomeDtoType
  column: any
  rowIndex: number
  columnIndex: number
}

interface PropsType {
  householdId: string
  doorNo: string
  tabCurrentId
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
      // console.log('item[key]', item[key]) //值

      key == 'id' && Reflect.deleteProperty(item, 'id')
    }
  })
  // console.log(tableData.value)
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
    size: 100,
    status: props.tabCurrentId == 2 ? 'review' : undefined
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
  // if (columnIndex == 1) {
  //   //合并相同的名字
  //   let nameSpan = getSpanNumber(tableData.value, 'type')
  //   return {
  //     rowspan: nameSpan[rowIndex],
  //     colspan: 1
  //   }
  // }

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
// 合并单元格方法
// function getSpanNumber(data, prop) {
//   //data要处理的数组，prop要合并的属性，比如name

//   //数组的长度，有时候后台可能返回个null而不是[]
//   let length = Array.isArray(data) ? data.length : 0
//   if (length > 0) {
//     //用于标识位置
//     let position = 0
//     //用于对比的数据
//     let temp = data[0][prop]
//     //要返回的结果
//     let result = [1]
//     //假设数据是AABCC，我们的目标就是返回20120
//     for (let i = 1; i < length; i++) {
//       if (data[i][prop] == temp) {
//         //标识位置的数据加一
//         result[position] += 1
//         //当前位置添0
//         result[i] = 0
//       } else {
//         //不相同时，修改标识位置，该位置设为1，修改对比值
//         position = i
//         result[i] = 1
//         temp = data[i][prop]
//       }
//     }
//     //返回结果
//     return result
//   } else {
//     return [0]
//   }
// }

// 小计
const getSubtotal = (type: string) => {
  for (let typeItem of cateTypes.value) {
    if (`subtotal-${typeItem}` === type) {
      const tableList = tableData.value.filter((item) => item.type === typeItem)
      const result = tableList.reduce((pre, current) => {
        return pre + parseFloat(current.amount)
      }, 0)
      return result
    }
  }
}

// 总计
const total = computed(() => {
  const realTableData = tableData.value.filter((item) => !item.type.includes('total'))
  return realTableData.reduce((pre, current) => {
    return pre + parseFloat(current.amount)
  }, 0)
})

const onSave = () => {
  const realTableData = tableData.value.filter((item) => !item.type.includes('total'))
  // realTableData.push({ configType: 'PeasantHousehold' })

  saveFamilyIncomeListApi(realTableData).then(() => {
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
