<template>
  <ContentWrap title="用户管理">
    <div class="flex">
      <div class="min-w-200px pr-5px mr-8px border-r">
        <LeftPanel @search="onSearch" />
      </div>
      <div class="flex flex-col flex-grow">
        <div class="flex">
          <Search :schema="searchSchema" @search="searchUser" />
          <ElButton type="primary">新增</ElButton>
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
              <template #systemRole="{ row }">
                <el-tag :type="getRoleType(row)">
                  {{ getRoleName(row) }}
                </el-tag>
              </template>
              <template #createdDate="{ row }">
                {{ formatDate(row.createdDate) }}
              </template>
              <template #lastLoginTime="{ row }">
                {{ formatDateTime(row.lastLoginTime) }}
              </template>
              <template #action="{ row }">
                <TableEditColumn :row="row" @edit="editRow" @delete="deleteRow" />
              </template>
            </Table>
          </ContentWrap>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElTag, ElButton, ElMessageBox } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate, formatDateTime } from '@/utils'
import { Search } from '@/components/Search'
import { TableColumn } from '@/types/table'
import { FormSchema } from '@/types/form'
import { ProjectRoleEnum, SystemRoleEnum, UserInfoType } from '@/api/sys/types'
import { listUserApi, getSystemRoleName, getProjectRoleName } from '@/api/sys'
import { LeftPanel } from './components'

const appStore = useAppStore()

const searchSchema = reactive<FormSchema[]>([
  { field: 'blurry', label: '用户名', component: 'Input' },
  {
    field: 'enabled',
    label: '状态',
    component: 'Select',
    formItemProps: {
      style: { width: '180px' }
    },
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false }
      ]
    }
  }
])

const editRow = (row: UserInfoType) => {
  console.log(row)
}

const deleteRow = (row: UserInfoType) => {
  console.log(row)
}

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '80px' },
  { field: 'userName', label: '用户名' },
  { field: 'nickName', label: '姓名', width: '120px' },
  { field: 'systemRole', label: '用户角色', width: '120px' },
  { field: 'phone', label: '手机号', width: '120px' },
  { field: 'sex', label: '性别', width: '80px' },
  { field: 'createdDate', label: '创建日期', width: '120px' },
  { field: 'lastLoginTime', label: '最近登录', width: '180px' },
  { field: 'action', label: '操作', width: '120px', align: 'right' }
])

const { register, tableObject, methods } = useTable({
  getListApi: listUserApi,
  props: {
    columns
  }
})

tableObject.params = {
  projectId: appStore.getCurrentProjectId,
  enabled: null,
  blurry: null,
  orgId: null,
  roleId: null
}

const { getList } = methods

const searchUser = (data: any) => {
  tableObject.params.blurry = data.blurry
  tableObject.params.enabled = data.enabled === '' ? null : !!data.enabled
  if (!tableObject.params.projectId) {
    tableObject.params.projectId = appStore.getCurrentProjectId
  }
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

const getRoleType = (row: UserInfoType) => {
  if (row.systemRole === SystemRoleEnum.SYS_ADMIN) {
    return ''
  }
  if (row.projectUsers) {
    const item = row.projectUsers.find((x) => x.projectId === appStore.getCurrentProjectId)
    return item?.projectRole === ProjectRoleEnum.PROJECT_ADMIN ? 'success' : 'info'
  }
  return 'info'
}

const getRoleName = (row: UserInfoType) => {
  if (row.systemRole === SystemRoleEnum.SYS_ADMIN) {
    return getSystemRoleName(row.systemRole)
  }
  if (row.projectUsers) {
    const item = row.projectUsers.find((x) => x.projectId === appStore.getCurrentProjectId)
    if (item) {
      return getProjectRoleName(item.projectRole)
    }
  }
  return '普通用户'
}

const onSearch = (query: any) => {
  tableObject.params.projectId = query.projectId || appStore.getCurrentProjectId
  tableObject.params.orgId = query.orgId
  tableObject.params.roleId = query.roleId
  getList()
}
</script>
