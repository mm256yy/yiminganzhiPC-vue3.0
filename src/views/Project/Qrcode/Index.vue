<template>
  <ContentWrap title="二维码管理">
    <div class="flex justify-between mb-10px">
      <div class="flex">
        <ElInput v-model="query.projectName" placeholder="请输入项目名称" class="mr-10px w-200px" />
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
        <ElButton type="primary" @click="searchProject"> 查询 </ElButton>
        <ElButton @click="reset">重置</ElButton>
      </div>
      <!-- <Search :schema="searchSchema" @search="searchProject" /> -->
      <ElButton type="primary" @click="onAddProject">新增</ElButton>
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
          <template #townCode="{ row }">
            <div>
              {{
                `
              ${row.cityCodeText ? row.cityCodeText + '/' : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? '/' + row.townCodeText : ''}
             ${row.villageText ? '/' + row.villageText : ''}
             ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
            `
              }}
            </div>
          </template>

          <template #fileUrl="{ row }">
            <img :src="row.fileUrlStr" alt="封面" style="height: 80px" />
          </template>
          <template #action="{ row }">
            <TableEditColumn :row="row" :delete="true" @edit="onEdit" @delete="onDelete" />
          </template>
        </Table>
      </ContentWrap>
    </div>
    <EditForm
      v-if="showEdit"
      :row="currentRow"
      :show="showEdit"
      @close="onCloseEdit"
      :actionType="actionType"
      :projectData="projectData"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessageBox, ElTreeSelect, ElInput, ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { TableColumn } from '@/types/table'
import { PolicyDtoType } from '@/api/project/qrCode/types'
import { getQrcodeApi, delQrcodeByIdApi } from '@/api/project/qrCode/service'
import { listProjectApi } from '@/api/project'
import { TreeNodeType } from '@/api/common'
// import { DistrictNodeType } from '@/api/district/types'
// import { TreeNodeType } from '@/api/common'
import { getDistrictChildrenApi } from '@/api/district'
import EditForm from './EditForm.vue'
const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<any>()
const showConfig = ref(false)
let currProjectId = ref<number | undefined>()
const currentConfigInfo = ref<any>()
const actionType = ref<'view' | 'add' | 'edit'>('add')
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
const rootNodeId = -1
const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'projectName', label: '水库项目' },
  { field: 'townCode', label: '所属区域' },
  { field: 'fileUrl', label: '二维码附件' },
  { field: 'url', label: 'URL' },
  { field: 'remark', label: '备注' },
  // { field: 'description', label: '项目简介', showOverflowTooltip: true },
  { field: 'action', label: '操作', width: '140px', align: 'right' }
])

// const onProjectConfig = (row: PolicyDtoType) => {
//   getQrcodeApi(row.id).then((data) => {
//     if (data && data.id) {
//       currentConfigInfo.value = data
//       currProjectId.value = row.id
//       showConfig.value = true
//     }
//     if (data && !data.id) {
//       currentConfigInfo.value = undefined
//       currProjectId.value = row.id
//       showConfig.value = true
//     }
//   })
// }

// const otherIcons: TableColumnActionIcon[] = [
//   { icon: 'ant-design:setting-outlined', type: '', tooltip: '配置', action: onProjectConfig }
// ]

const { register, tableObject, methods } = useTable({
  getListApi: getQrcodeApi,
  props: {
    columns
  }
})

const query: any = reactive({
  name: null,
  page: tableObject.currentPage,
  size: tableObject.size
})
tableObject.params = {
  name: null,
  townCode: null,
  sort: ['createdDate', 'Desc']
}
const { getList } = methods
const searchProject = () => {
  tableObject.params.projectName = query.projectName
  tableObject.params.townCode = townCode
  getList()
}

const reset = () => {
  tableObject.currentPage = 1
  tableObject.size = 10
  tableObject.params.projectName = null
  tableObject.params.townCode = null
  query.projectName = null
  query.townCode = null
  getList()
}
console.log(tableObject.tableList, '1111111111')
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

const onEdit = (row: PolicyDtoType) => {
  currentRow.value = row
  showEdit.value = true
  actionType.value = 'edit'
}

const onDelete = (row: PolicyDtoType) => {
  console.log('删除')
  ElMessageBox.confirm(`确定要删除项目 ${row.name} 吗？`)
    .then(async () => {
      await delQrcodeByIdApi(row.id)
      ElMessage.success('删除用户成功')
      getList()
    })
    .catch(() => {})
}

const onAddProject = () => {
  currentRow.value = undefined
  showEdit.value = true
  actionType.value = 'add'
}

const onCloseEdit = () => {
  showEdit.value = false
  getList()
}

const onCloseConfig = () => {
  showConfig.value = false
  getList()
}
let projectData = ref()
const loadProject = async () => {
  const root: any = []
  const projects = await listProjectApi({ page: 0, size: 100 })
  projects.content.forEach((p) => {
    root.push({
      id: p.id.toString(),
      label: p.name,
      children: []
    })
  })
  projectData.value = root
  console.log(projectData.value)
}
onMounted(() => {
  loadProject()
})
</script>
