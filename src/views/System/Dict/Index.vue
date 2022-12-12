<template>
  <ContentWrap>
    <div class="flex">
      <div class="min-w-560px w-36% pr-5px mr-8px">
        <ContentWrap title="字典管理">
          <div class="flex justify-between flex-wrap mb-5px">
            <div class="mr-5px">
              <ElInput
                v-model="blurry"
                placeholder="请输入字典名称或描述"
                class="mr-10px"
                style="width: 200px"
              />
              <ElSelect v-model="dictGroup" class="mr-10px" placeholder="请选择分组">
                <ElOption v-for="item in dictGroupList" :key="item" :label="item" :value="item" />
              </ElSelect>
              <ElButton type="primary" @click="searchDict"> 查询 </ElButton>
              <ElButton @click="reset">重置</ElButton>
            </div>
            <ElButton v-if="appStore.getIsSysAdmin" type="primary" @click="onAddDict"
              >新增</ElButton
            >
          </div>
          <div>
            <ContentWrap>
              <Table
                v-model:current-page="tableObject.currentPage"
                v-model:page-size="tableObject.size"
                :loading="tableObject.loading"
                :pagination="{
                  total: tableObject.total
                }"
                highlight-current-row
                border
                header-align="center"
                align="center"
                :data="tableObject.tableList"
                :span-method="objectSpanMethod"
                @register="register"
                @row-click="handleRowClick"
              >
                <template v-if="appStore.getIsSysAdmin" #action="{ row }">
                  <TableEditColumn :row="row" @edit="onEdit" @delete="onDelete" />
                </template>
              </Table>
            </ContentWrap>
          </div>
        </ContentWrap>
      </div>
      <ContentWrap class="flex flex-col flex-grow" title="字典详情">
        <DictDetail :name="currentName" :dict-id="currentId" />
      </ContentWrap>
    </div>
    <EditForm
      v-if="showEdit"
      :row="currentRow"
      :show="showEdit"
      :group-list="dictGroupList"
      @close="onClose"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
// 公共组件
import { ElButton, ElMessageBox, ElMessage, ElSelect, ElOption, ElInput } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
// 公共类型
import { TableColumn } from '@/types/table'
// 接口及自定义数据类型
import { DictInfoType } from '@/api/sys/types'
import { listDictApi, deleteDictApi, getDictGroupListApi } from '@/api/sys'
// 页面组件
import { EditForm, DictDetail } from './components'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<DictInfoType>()
let currentId = ref<number>(0)
let currentName = ref<string>('')
const projectId = ref<number>(0)
const dictGroupList = ref<any[]>([])
const dictGroup = ref<string>()
const blurry = ref<string>()

const columns = reactive<TableColumn[]>([
  { field: 'dictGroup', label: '分组' },
  { field: 'name', label: '名称' },
  { field: 'remark', label: '描述' },
  { field: 'action', label: '操作', width: '120px', align: 'right' }
])

const { register, tableObject, methods } = useTable({
  getListApi: listDictApi,
  props: {
    columns
  }
})

tableObject.params = {
  group: null,
  blurry: null
}

const { getList } = methods

const searchDict = () => {
  tableObject.params.blurry = blurry.value
  tableObject.params.dictGroup = dictGroup.value
  getList()
}

const reset = () => {
  dictGroup.value = ''
  blurry.value = ''
  tableObject.currentPage = 1
  tableObject.size = 10
}

const getDictGroupList = () => {
  getDictGroupListApi().then((data) => {
    dictGroupList.value = data
    console.log('dictGroupList', dictGroupList.value, data)
  })
}

onMounted(() => {
  projectId.value = appStore.getCurrentProjectId
  if (!appStore.getIsSysAdmin && !appStore.getIsProjectAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {})
  } else {
    getList()
    getDictGroupList()
  }
})

const onEdit = (row: DictInfoType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: DictInfoType) => {
  ElMessageBox.confirm(`确定要删除字典 ${row.name} 吗？`)
    .then(async () => {
      await deleteDictApi(row.id ?? 0)
      ElMessage.success('删除用户成功')
      getList()
    })
    .catch(() => {})
}

const onAddDict = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onClose = () => {
  showEdit.value = false
  getList()
}

const handleRowClick = (row: DictInfoType) => {
  currentRow.value = row
  currentName.value = row.name
  currentId.value = row.id ?? 0
}

interface SpanMethodProps {
  row: DictInfoType
  column: TableColumnCtx<DictInfoType>
  rowIndex: number
  columnIndex: number
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  console.log(column)
  if (columnIndex === 0) {
    // 如果与上一个分组名称相同，被合并
    if (rowIndex !== 0 && row.dictGroup === tableObject.tableList[rowIndex - 1].dictGroup) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
    // 统计新的分组所占行数
    let index = rowIndex + 1
    let rowspan = 1
    while (index < tableObject.tableList.length) {
      if (row.dictGroup === tableObject.tableList[index].dictGroup) {
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
