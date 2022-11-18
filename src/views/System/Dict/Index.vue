<template>
  <ContentWrap>
    <div class="flex">
      <div class="min-w-560px w-36% pr-5px mr-8px">
        <ContentWrap title="字典管理">
          <div class="flex flex-wrap mb-5px">
            <Search :schema="searchSchema" @search="searchDict" />
            <ElButton type="primary" @click="onAddDict">新增</ElButton>
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
                header-align="center"
                align="center"
                :data="tableObject.tableList"
                hig
                @register="register"
                @row-click="handleRowClick"
              >
                <template #action="{ row }">
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
    <EditForm v-if="showEdit" :row="currentRow" :show="showEdit" @close="onClose" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
// 公共组件
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
// 公共类型
import { TableColumn } from '@/types/table'
import { FormSchema } from '@/types/form'
// 接口及自定义数据类型
import { DictInfoType } from '@/api/sys/types'
import { listDictApi, deleteDictApi } from '@/api/sys'
// 页面组件
import { EditForm, DictDetail } from './components'

const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<DictInfoType>()
let currentId = ref<number>(0)
let currentName = ref<string>('')
const projectId = ref<number>(0)

const searchSchema = reactive<FormSchema[]>([
  { field: 'blurry', label: '名称或描述', component: 'Input' }
])

const columns = reactive<TableColumn[]>([
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
  blurry: null
}

const { getList } = methods

const searchDict = (data: any) => {
  tableObject.params.blurry = data.blurry
  getList()
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
</script>
