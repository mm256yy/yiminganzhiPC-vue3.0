<template>
  <ContentWrap title="家庭收入项配置">
    <div class="flex mb-5">
      <!-- 系统管理员时增加 ELSelect 下拉选择项目 -->
      <ElSelect class="w-230px mr-20px" placeholder="选择项目" v-model="projectId" @change="change">
        <ElOption
          v-for="item in projectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
      <!-- <ElButton v-if="appStore.getIsSysAdmin" type="primary" @click="searchFamilyIncome"
        >查询</ElButton
      > -->
      <ElButton
        v-if="appStore.getIsSysAdmin || appStore.getIsProjectAdmin"
        type="primary"
        @click="onAddFamilyIncome"
        >新增</ElButton
      >
    </div>
    <div>
      <ContentWrap>
        <Table
          border
          :loading="tableObject.loading"
          header-align="center"
          align="center"
          :data="tableObject.tableList"
          class="w-90%"
          @register="register"
          :span-method="objectSpanMethod"
        >
          <template #action="{ row }">
            <TableEditColumn :row="row" @edit="onEdit" @delete="onDelete" />
          </template>
          <template #type="{ row }">
            <div v-if="tabType == 'PeasantHousehold'">
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
            <div v-else>
              {{ getTypeList2Lable(row.type) }}
            </div>
          </template>
        </Table>
      </ContentWrap>
    </div>
  </ContentWrap>
  <EditForm
    v-if="showEdit"
    :row="currentRow"
    :show="showEdit"
    @close="onClose"
    :tabType="tabType"
    :typeList2="typeList2"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
// 公共组件
import { ElButton, ElMessageBox, ElMessage, ElSelect, ElOption } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
// 公共类型
import { TableColumn } from '@/types/table'
// 接口及自定义数据类型
import { FamilyIncomeInfoType } from '@/api/sys/familyIncome/types'
import { listFamilyIncomeApi, deleteFamilyIncomeApi } from '@/api/sys/familyIncome/service'
// import { listProjectApi } from '@/api/project'
// 页面组件
import EditForm from './EditForm.vue'
const tabType = ref<string>('PeasantHousehold')
const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<FamilyIncomeInfoType>()
const projectId = ref()
// const projectList = ref<Array<{ label: string; value: number }>>([])

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'type', label: '类型' },
  { field: 'name', label: '收入项名称' },
  { field: 'sort', label: '排序' },
  { field: 'action', label: '操作', width: '120px', align: 'right' }
])
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
const projectList = ref([
  {
    value: 'PeasantHousehold',
    label: '家庭收入项配置'
  },
  {
    value: 'Company',
    label: '企业经营现状'
  }
])
// methods
const { register, tableObject } = useTable({
  getListApi: listFamilyIncomeApi,
  props: {
    columns
  }
})
const getTypeList2Lable = (val) => {
  return typeList2.value.find((item) => item.value != ' ' && item.value == val)?.label
}
// const { getList } = methods

const getListType = (type) => {
  listFamilyIncomeApi(type).then((res: any) => {
    tableObject.tableList = res.content
    tableObject.loading = false
    // console.log()
  })
}
// const loadProject = () => {
//   return listProjectApi({ page: 0, size: 100 }).then((res) => {
//     const pjs = res.content.map((p) => {
//       return {
//         value: p.id,
//         label: p.name
//       }
//     })
//     projectList.value = pjs
//     projectId.value = pjs[0].value
//   })
// }
const change = (val) => {
  tabType.value = val
  getListType(val)
}
onMounted(() => {
  // if (appStore.getIsSysAdmin) {
  //   loadProject()
  // }
  getListType(tabType.value)
})

// const searchFamilyIncome = () => {
//   tableObject.params.projectId = projectId.value
//   getList()
// }

const onEdit = (row: FamilyIncomeInfoType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: FamilyIncomeInfoType) => {
  ElMessageBox.confirm(`确定要删除项目 ${row.name} 吗？`)
    .then(async () => {
      await deleteFamilyIncomeApi(row.id ?? 0)
      ElMessage.success('删除成功')
      getListType(tabType.value)
    })
    .catch(() => {})
}

const onAddFamilyIncome = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onClose = () => {
  showEdit.value = false
  getListType(tabType.value)
}

interface SpanMethodProps {
  row: FamilyIncomeInfoType
  column: TableColumnCtx<FamilyIncomeInfoType>
  rowIndex: number
  columnIndex: number
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  console.log(column)
  if (columnIndex === 1) {
    // 如果与上一个分组名称相同，被合并
    if (rowIndex !== 0 && row.type === tableObject.tableList[rowIndex - 1].type) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
    // 统计新的分组所占行数
    let index = rowIndex + 1
    let rowspan = 1
    while (index < tableObject.tableList.length) {
      if (row.type === tableObject.tableList[index].type) {
        rowspan++
        index++
      } else {
        break
      }
    }
    return {
      rowspan: rowspan,
      colspan: 1
    }
  }
}
</script>
