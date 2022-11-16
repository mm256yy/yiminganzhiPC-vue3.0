<template>
  <div class="flex">
    <Search :schema="searchSchema" @search="searchDictDetail" />
    <ElButton type="primary" @click="onAddDictDetail">新增</ElButton>
  </div>
  <div>
    <ContentWrap>
      <Table
        v-model:current-page="tableObject.currentPage"
        v-model:page-size="tableObject.size"
        :loading="tableObject.loading"
        header-align="center"
        align="center"
        :data="tableObject.tableList"
        @register="register"
      >
        <template #action="{ row }">
          <TableEditColumn :row="row" @edit="onEdit" @delete="onDelete" />
        </template>
      </Table>
    </ContentWrap>
  </div>
  <EditFormDetail v-if="showEdit" :row="currentRow" :show="showEdit" @close="onClose" />
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
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
import { DictDetailType } from '@/api/sys/types'
import { listDictDetailApi, deleteDictDetailApi } from '@/api/sys'
// 页面组件
import EditFormDetail from './EditFormDetail.vue'

const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<DictDetailType>()
const projectId = ref<number>(0)
interface Props {
  name: String
}
const props = defineProps<Props>()

const searchSchema = reactive<FormSchema[]>([
  { field: 'projectId', label: '项目', component: 'Input' }
])

const columns = reactive<TableColumn[]>([
  // { field: 'name', label: '所属字典' },
  { field: 'label', label: '字典标签' },
  { field: 'value', label: '字典值' },
  { field: 'sort', label: '排序' },
  { field: 'action', label: '操作', width: '120px', align: 'right' }
])

const getTableList = async (): Promise<TableResponse> => {
  const data = await listDictDetailApi(tableObject.params)
  const tableList = {
    total: 0,
    content: data.dictValList,
    page: 1,
    size: 1000,
    other: ''
  }
  return Promise.resolve(tableList)
}

const { register, tableObject, methods } = useTable({
  getListApi: getTableList,
  props: {
    columns
  }
})

tableObject.params = {
  name: null,
  projectId: appStore.getCurrentProjectId
}

const { getList } = methods

// onMounted(() => {
//   if (!appStore.getIsSysAdmin && !appStore.getIsProjectAdmin) {
//     ElMessageBox.confirm('你在当前项目中无权限')
//       .then(() => {
//         window.location.href = '/#/dashboard/home'
//       })
//       .catch(() => {})
//   } else {
//     // if (appStore.getIsProjectAdmin) {
//     //   projectId.value =
//     // }
//     getList()
//   }
// })

watch(
  () => props.name,
  () => {
    console.log('props', props)
    tableObject.params.name = props.name
    getList()
  }
)

const searchDictDetail = (data: any) => {
  if (appStore.getIsProjectAdmin && data.projectId) {
    tableObject.params.projectId = data.projectId
    getList()
  } else if (appStore.getIsSysAdmin) {
    tableObject.params.projectId = appStore.getCurrentProjectId
    getList()
  }
}
const onEdit = (row: DictDetailType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: DictDetailType) => {
  ElMessageBox.confirm(`确定要删除该字典详情 ${row.label} 吗？`)
    .then(async () => {
      await deleteDictDetailApi(row.id ?? 0, projectId.value)
      ElMessage.success('删除用户成功')
      getList()
    })
    .catch(() => {})
}

const onAddDictDetail = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onClose = () => {
  showEdit.value = false
  getList()
}
</script>
