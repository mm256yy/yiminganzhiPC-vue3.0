<template>
  <ContentWrap title="用户管理">
    <div class="flex">
      <div class="min-w-200px pr-5px mr-8px border-r">
        <LeftPanel @search="onSearch" />
      </div>
      <div class="flex flex-col flex-grow">
        <div class="flex justify-between">
          <Search :schema="searchSchema" @search="searchUser" />
          <ElButton type="primary" @click="onAddUser">新增</ElButton>
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
              <template #enabled="{ row }">
                <el-tag :type="row.enabled ? '' : 'warning'">{{
                  row.enabled ? '启用' : '禁用'
                }}</el-tag>
              </template>
              <template #createdDate="{ row }">
                {{ formatDate(row.createdDate) }}
              </template>
              <template #lastLoginTime="{ row }">
                {{ formatDateTime(row.lastLoginTime) }}
              </template>
              <template #action="{ row }">
                <TableEditColumn
                  :row="row"
                  :icons="otherIcons"
                  @edit="onEdit"
                  @delete="onDelete"
                  :delete="false"
                />
              </template>
            </Table>
          </ContentWrap>
        </div>
      </div>
    </div>
    <EditForm v-if="showEdit" :row="currentRow" :show="showEdit" @close="onClose" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElTag, ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table, TableEditColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate, formatDateTime } from '@/utils'
import { Search } from '@/components/Search'
import { TableColumn, TableColumnActionIcon } from '@/types/table'
import { FormSchema } from '@/types/form'
import { ProjectRoleEnum, SystemRoleEnum, UserInfoType } from '@/api/sys/types'
import {
  listUserApi,
  getSystemRoleName,
  getProjectRoleName,
  deleteUserApi,
  resetPwdApi
} from '@/api/sys'
import { LeftPanel, EditForm } from './components'
const showType = ref()
const appStore = useAppStore()
const showEdit = ref(false)
const currentRow = ref<UserInfoType>()

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

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'userName', label: '用户名' },
  { field: 'nickName', label: '姓名' },
  { field: 'systemRole', label: '用户角色' },
  { field: 'phone', label: '手机号' },
  { field: 'sex', label: '性别', width: '60px' },
  { field: 'enabled', label: '状态', width: '70px' },
  { field: 'createdDate', label: '创建日期' },
  { field: 'lastLoginTime', label: '最近登录' },
  { field: 'action', label: '操作', width: '140px', align: 'right' }
])

const onResetPwd = (row: UserInfoType) => {
  ElMessageBox.confirm(`确认要重置用户 ${row.nickName} 的密码？`)
    .then(async () => {
      await resetPwdApi(row.id as number)
      ElMessage.success('密码重置成功')
    })
    .catch(() => {})
}

const otherIcons: TableColumnActionIcon[] = [
  { icon: 'material-symbols:lock-reset-rounded', type: '', tooltip: '重置密码', action: onResetPwd }
]

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
  if (appStore.getIsSysAdmin && row.systemRole === SystemRoleEnum.PROJECT_ADMIN) {
    return 'success'
  }
  if (row.projectUsers) {
    const item = row.projectUsers.find((x) => x.projectId === appStore.getCurrentProjectId)
    return item?.projectRole === ProjectRoleEnum.PROJECT_ADMIN ? 'success' : 'info'
  }
  return 'info'
}

const getRoleName = (row: UserInfoType) => {
  // 如果当前用户是系统管理员，则直接显示用户本身的系统角色，如果用户属于多个项目，只要有一个是项目管理员，那用户的系统角色就是项目管理员
  if (appStore.getIsSysAdmin || row.systemRole === SystemRoleEnum.SYS_ADMIN) {
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

const onEdit = (row: UserInfoType) => {
  console.log(row, 'rowrow')

  currentRow.value = row
  showEdit.value = true
  showType.value = 'view'
}

const onDelete = (row: UserInfoType) => {
  ElMessageBox.confirm(`确定要删除该用户 ${row.nickName} 吗？`)
    .then(async () => {
      const projectId = appStore.getIsSysAdmin ? undefined : appStore.getCurrentProjectId
      await deleteUserApi(row.id ?? 0, projectId)
      ElMessage.success('删除用户成功')
      getList()
    })
    .catch(() => {})
}

const onAddUser = () => {
  currentRow.value = undefined
  showEdit.value = true
  showType.value = 'add'
}

const onClose = () => {
  showEdit.value = false
  getList()
}
</script>
