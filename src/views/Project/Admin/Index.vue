<template>
  <ContentWrap title="项目管理">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="searchProject" />
      <ElButton v-if="appStore.getIsSysAdmin" type="primary" @click="onAddProject">新增</ElButton>
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
          @register="register"
        >
          <template #action="{ row }">
            <TableEditColumn :row="row" :icons="otherIcons" @edit="onEdit" @delete="onDelete" />
          </template>
        </Table>
      </ContentWrap>
    </div>
    <EditForm v-if="showEdit" :row="currentRow" :show="showEdit" @close="onCloseEdit" />
    <ProjectConfig
      v-if="showConfig"
      :row="currentConfigInfo"
      :show="showConfig"
      :project-id="currProjectId"
      @close="onCloseConfig"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { TableColumn, TableColumnActionIcon } from '@/types/table'
import { FormSchema } from '@/types/form'
import { ProjectDtoType, ProjectConfigType } from '@/api/project/types'
import { listProjectApi, deleteProjectApi, projectConfigApi } from '@/api/project'
import { EditForm, ProjectConfig } from './components'

const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<ProjectDtoType>()
const showConfig = ref(false)
let currProjectId = ref<number | undefined>()
const currentConfigInfo = ref<ProjectConfigType>()

const searchSchema = reactive<FormSchema[]>([
  { field: 'name', label: '项目名称', component: 'Input' }
])

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'name', label: '项目名称' },
  { field: 'description', label: '项目简介' },
  { field: 'action', label: '操作', width: '140px', align: 'right' }
])

const onProjectConfig = (row: ProjectDtoType) => {
  projectConfigApi(row.id).then((data) => {
    if (data && data.id) {
      currentConfigInfo.value = data
      currProjectId.value = row.id
      showConfig.value = true
    }
    if (data && !data.id) {
      currentConfigInfo.value = undefined
      currProjectId.value = row.id
      showConfig.value = true
    }
  })
}

const otherIcons: TableColumnActionIcon[] = [
  { icon: 'ant-design:setting-outlined', type: '', tooltip: '配置', action: onProjectConfig }
]

const { register, tableObject, methods } = useTable({
  getListApi: listProjectApi,
  props: {
    columns
  }
})

tableObject.params = {
  name: null
}

const { getList } = methods

const searchProject = (data: any) => {
  tableObject.params.name = data.name
  getList()
}

onMounted(() => {
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

const onEdit = (row: ProjectDtoType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: ProjectDtoType) => {
  ElMessageBox.confirm(`确定要删除项目 ${row.name} 吗？`)
    .then(async () => {
      await deleteProjectApi(row.id)
      ElMessage.success('删除用户成功')
      getList()
    })
    .catch(() => {})
}

const onAddProject = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onCloseEdit = () => {
  showEdit.value = false
  getList()
}

const onCloseConfig = () => {
  showConfig.value = false
  getList()
}
</script>
