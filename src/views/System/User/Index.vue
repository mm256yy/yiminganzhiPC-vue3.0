<template>
  <div :class="prefixCls" class="h-full">
    <div class="flex">
      <div v-if="showLeftTree">tree</div>
      <div class="flex flex-col flex-grow">
        <div class="flex">
          <Search :schema="searchSchema" @search="searchUser" />
          <ElButton type="primary">新增</ElButton>
        </div>
        <div>
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
              <el-tag
                :type="
                  row.systemRole === SystemRoleEnum.SYS_ADMIN
                    ? ''
                    : row.systemRole === SystemRoleEnum.PROJECT_ADMIN
                    ? 'success'
                    : 'info'
                "
              >
                {{ getSystemRoleName(row.systemRole) }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ElTag, ElButton } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { ProjectRoleEnum, SystemRoleEnum, UserInfoType } from '@/api/sys/types'
import { useTable } from '@/hooks/web/useTable'
import { listUserApi, getSystemRoleName } from '@/api/sys'
import { TableColumn } from '@/types/table'
import { formatDate, formatDateTime } from '@/utils'
import { FormSchema } from '@/types/form'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('home')
const appStore = useAppStore()

const showLeftTree = computed(() => {
  // 如果当前用户所管理的项目中，在当前选择的项目里是项目管理员，则显示，否则隐藏
  if (appStore.getUserJwtInfo?.systemRole == SystemRoleEnum.SYS_ADMIN) {
    return false
  }
  if (appStore.getUserInfo?.projectUsers) {
    const projectUser = appStore.getUserInfo.projectUsers.find(
      (x) => x.projectId == appStore.getCurrentProjectId
    )
    return projectUser?.projectRole == ProjectRoleEnum.PROJECT_ADMIN
  }
  return false
})

const searchSchema = reactive<FormSchema[]>([
  { field: 'projectId', component: 'Input', hidden: true },
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
  { field: 'systemRole', label: '系统角色', width: '120px' },
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
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-home';
</style>
