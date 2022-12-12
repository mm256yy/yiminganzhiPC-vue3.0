<template>
  <ContentWrap title="项目管理">
    <div class="flex justify-between mb-10px">
      <div class="flex">
        <ElInput v-model="query.name" placeholder="请输入项目名称" class="mr-10px w-200px" />
        <!-- default-expanded-keys="[]"
          default-checked-keys="[]" -->
        <ElTreeSelect
          ref="districtTree"
          v-model="townCode"
          lazy
          multiple
          node-key="code"
          :load="loadDistrictNode"
          :props="defaultProps"
          :style="{ width: '320px', 'margin-right': '10px' }"
          placeholder="请选择行政区域"
        />
        <ElButton v-if="appStore.getIsSysAdmin" type="primary" @click="searchProject">
          查询
        </ElButton>
        <ElButton v-if="appStore.getIsSysAdmin" @click="reset">重置</ElButton>
      </div>
      <!-- <Search :schema="searchSchema" @search="searchProject" /> -->
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
          <template #projectType="{ row }">
            {{ getProjectTypeName(row.projectType) }}
          </template>
          <template #townCode="{ row }">
            {{ row.townName }}
          </template>
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
import { ElButton, ElMessageBox, ElMessage, ElTreeSelect, ElInput } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { TableColumn, TableColumnActionIcon } from '@/types/table'
import { ProjectDtoType, ProjectConfigType, ProjectQueryType } from '@/api/project/types'
import { listProjectApi, deleteProjectApi, projectConfigApi } from '@/api/project'
// import { DistrictNodeType } from '@/api/district/types'
// import { TreeNodeType } from '@/api/common'
import { getDistrictChildrenApi } from '@/api/district'
import { EditForm, ProjectConfig } from './components'
const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<ProjectDtoType>()
const showConfig = ref(false)
let currProjectId = ref<number | undefined>()
const currentConfigInfo = ref<ProjectConfigType>()

const townCode = ref()
const defaultProps = {
  value: 'code',
  label: 'name',
  disabled: (node) => {
    return node && node.data && node.data.hasChild && node.level !== 3
  },
  isLeaf: (node) => {
    return node.level === 3
  }
}

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'name', label: '项目名称' },
  { field: 'showName', label: '项目简称' },
  { field: 'reservoirName', label: '水库名称' },
  { field: 'projectType', label: '工程类型' },
  { field: 'townName', label: '所在市县' },
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

const query: ProjectQueryType = reactive({
  name: null,
  page: tableObject.currentPage,
  size: tableObject.size
})

tableObject.params = {
  name: null,
  townCode: null
}

const { getList } = methods

const searchProject = () => {
  tableObject.params.name = query.name
  tableObject.params.townCode = townCode
  getList()
}

const reset = () => {
  query.name = ''
  query.townCode = ''
  tableObject.currentPage = 1
  tableObject.size = 10
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

const loadDistrictNode = async (node: any, resolve: any) => {
  if (node.level === 3) {
    resolve([])
    return
  }
  let parentId
  if (node && node.level == 0) {
    parentId = 0
  } else {
    parentId = node.data.id
  }
  const childrenList = await getDistrictChildrenApi(parentId)
  resolve(childrenList)
}

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

const getProjectTypeName = (value: string) => {
  const projectTypes = [
    { name: '水电工程', value: 'Hydropowerproject' },
    { name: '水利枢纽', value: 'HydroJunction' }
  ]
  const projectType = projectTypes.find((o) => o.value === value)
  if (projectType) {
    return projectType.name
  }
}
</script>
