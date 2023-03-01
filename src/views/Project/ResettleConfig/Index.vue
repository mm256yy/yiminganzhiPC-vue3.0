<template>
  <ContentWrap title="安置意愿项配置">
    <div class="flex mb-5">
      <!-- 系统管理员时增加 ELSelect 下拉选择项目 -->
      <ElSelect
        v-if="appStore.getIsSysAdmin"
        class="w-230px mr-20px"
        placeholder="选择项目"
        v-model="projectId"
      >
        <ElOption
          v-for="item in projectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
      <ElButton v-if="appStore.getIsSysAdmin" type="primary" @click="searchResettleConfig"
        >查询</ElButton
      >
      <ElButton
        v-if="appStore.getIsSysAdmin || appStore.getIsProjectAdmin"
        type="primary"
        @click="onAddResettleConfig"
        >新增</ElButton
      >
    </div>
    <div>
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
      </Table>
    </div>
  </ContentWrap>
  <EditForm
    v-if="showEdit"
    :row="currentRow"
    :show="showEdit"
    :project-id="projectId"
    :project-list="projectList"
    @close="onClose"
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
import { ResettleConfigInfoType } from '@/api/project/resettleConfig/types'
import {
  listResettleConfigApi,
  deleteResettleConfigApi
} from '@/api/project/resettleConfig/service'
import { listProjectApi } from '@/api/project'
// 页面组件
import EditForm from './EditForm.vue'

const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<ResettleConfigInfoType>()
const projectId = ref<number>(appStore.getCurrentProjectId)
const projectList = ref<Array<{ label: string; value: number }>>([])

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'type', label: '安置类型' },
  { field: 'way', label: '安置方式' },
  { field: 'area', label: '安置区域' },
  { field: 'action', label: '操作', width: '120px', align: 'right' }
])

const { register, tableObject, methods } = useTable({
  getListApi: listResettleConfigApi,
  props: {
    columns
  }
})

const { getList } = methods

const loadProject = () => {
  return listProjectApi({ page: 0, size: 100 }).then((res) => {
    const pjs = res.content.map((p) => {
      return {
        value: p.id,
        label: p.name
      }
    })
    projectList.value = pjs
    projectId.value = pjs[0].value
  })
}

onMounted(async () => {
  if (appStore.getIsSysAdmin) {
    await loadProject()
  }
  tableObject.params.projectId = projectId.value
  getList()
})

const searchResettleConfig = () => {
  tableObject.params.projectId = projectId.value
  getList()
}

const onEdit = (row: ResettleConfigInfoType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: ResettleConfigInfoType) => {
  ElMessageBox.confirm(`确定要删除该行数据吗？`)
    .then(async () => {
      await deleteResettleConfigApi(row.id ?? 0)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const onAddResettleConfig = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onClose = () => {
  showEdit.value = false
  getList()
}

interface SpanMethodProps {
  row: ResettleConfigInfoType
  column: TableColumnCtx<ResettleConfigInfoType>
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
