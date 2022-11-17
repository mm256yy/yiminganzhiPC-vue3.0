<template>
  <div v-if="name" class="flex mb-5">
    <el-select
      v-if="isAdmin"
      v-model="projectId"
      class="mr-30px"
      placeholder="请选择项目"
      clearable
    >
      <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
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
        class="w-90%"
        @register="register"
      >
        <template #name>
          <div>{{ name }}</div>
        </template>
        <template #action="{ row }">
          <TableEditColumn :row="row" @edit="onEdit" @delete="onDelete" />
        </template>
      </Table>
    </ContentWrap>
  </div>
  <EditFormDetail
    v-if="showEdit"
    :project-id="projectId"
    :dict-id="dictId"
    :row="currentRow"
    :show="showEdit"
    @close="onClose"
  />
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
// 公共组件
import { ElButton, ElMessageBox, ElMessage, ElSelect, ElOption } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
// 公共类型
import { TableColumn } from '@/types/table'
// 接口及自定义数据类型
import { DictDetailType } from '@/api/sys/types'
import { listDictDetailApi, deleteDictDetailApi } from '@/api/sys'
import { listProjectApi } from '@/api/project'
// 页面组件
import EditFormDetail from './EditFormDetail.vue'
import { ProjectQueryType } from '@/api/project/types'

const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<DictDetailType>()
const isAdmin = ref<boolean>(appStore.getIsSysAdmin)
let projectId = ref<number>()
let projectList = ref<any>([])
interface Props {
  name: string
  dictId: number
}
const props = defineProps<Props>()

const columns = reactive<TableColumn[]>([
  { field: 'name', label: '所属字典' },
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
  projectId: null
}
tableObject.loading = false

onMounted(() => {
  getProjectList({ page: 0, size: 100 })
})

watch(
  () => props.name,
  (val) => {
    if (val) {
      tableObject.params.name = val
      tableObject.params.projectId = projectId.value
        ? projectId.value
        : appStore.getCurrentProjectId
      getList()
    }
  }
)

watch(
  () => projectId.value,
  (val) => {
    tableObject.params.projectId = val ? val : appStore.getCurrentProjectId
    getList()
  }
)

const { getList } = methods

const onEdit = (row: DictDetailType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: DictDetailType) => {
  ElMessageBox.confirm(`确定要删除该字典详情 ${row.label} 吗？`)
    .then(async () => {
      await deleteDictDetailApi(row.id ?? 0, projectId.value ?? appStore.getCurrentProjectId)
      ElMessage.success('删除用户成功')
      getList()
    })
    .catch(() => {})
}

const onAddDictDetail = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const getProjectList = (row: ProjectQueryType) => {
  projectList.value = []
  listProjectApi(row).then((res) => {
    // res.content.push({ id: 0, name: '系统' })
    projectList.value = res.content
  })
}

const onClose = () => {
  showEdit.value = false
  getList()
}
</script>
