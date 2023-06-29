<template>
  <ContentWrap title="附属物配置">
    <div class="flex mb-5">
      <ElInput
        v-model="name"
        placeholder="请输入附属物名称进行查询"
        class="mr-10px"
        style="width: 200px"
      />
      <ElButton type="primary" @click="searchAppendant">查询</ElButton>
      <ElButton type="primary" @click="onAddAppendant">新增</ElButton>
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
          header-align="center"
          align="center"
          :data="tableObject.tableList"
          class="w-90%"
          @register="register"
        >
          <template #action="{ row }">
            <TableEditColumn :row="row" @edit="onEdit" @delete="onDelete" />
          </template>
        </Table>
      </ContentWrap>
    </div>
    <EditForm v-if="showEdit" :row="currentRow" :show="showEdit" @close="onClose" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
// 公共组件
import { ElButton, ElMessageBox, ElMessage, ElInput } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
// 公共类型
import { TableColumn } from '@/types/table'
// 接口及自定义数据类型
import { AppendantInfoType } from '@/api/sys/appendant/types'
import { listAppendantApi, deleteAppendantApi } from '@/api/sys/appendant/service'
// 页面组件
import EditForm from './EditForm.vue'

const showEdit = ref(false)
const currentRow = ref<AppendantInfoType>()
const name = ref<string>()

const columns = reactive<TableColumn[]>([
  { field: 'sort', label: '排序' },
  { field: 'name', label: '项目' },
  { field: 'size', label: '规格' },
  { field: 'unit', label: '单位' },
  { field: 'action', label: '操作', width: '120px', align: 'right' }
])

const { register, tableObject, methods } = useTable({
  getListApi: listAppendantApi,
  props: {
    columns
  }
})

tableObject.params.sort = 'sort,asc'

const { getList } = methods

onMounted(() => {
  getList()
})

const searchAppendant = () => {
  tableObject.params.name = name.value
  getList()
}

const onEdit = (row: AppendantInfoType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: AppendantInfoType) => {
  ElMessageBox.confirm(`确定要删除项目 ${row.name} 吗？`)
    .then(async () => {
      await deleteAppendantApi(row.id ?? 0)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const onAddAppendant = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onClose = () => {
  showEdit.value = false
  getList()
}
</script>
