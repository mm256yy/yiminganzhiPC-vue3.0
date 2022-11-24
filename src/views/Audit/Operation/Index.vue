<template>
  <ContentWrap title="登录日志">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="searchOperationLog" />
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
          <template #createTime="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
          <template #operationType="{ row }">
            <el-tag :type="getOperTagType(row.operationType)">{{
              getOperationName(row.operationType)
            }}</el-tag>
          </template>
        </Table>
      </ContentWrap>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElMessageBox, ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { TableColumn } from '@/types/table'
import { FormSchema } from '@/types/form'
import { OperationLogQueryType } from '@/api/audit/operation/types'
import { listOperationLogApi } from '@/api/audit/operation'
import { formatDateTime } from '@/utils'

const appStore = useAppStore()
const operationList = ref<any[]>([
  { label: '新增', value: 'ADD' },
  { label: '编辑', value: 'EDIT' },
  { label: '删除', value: 'DELETE' },
  { label: '查看详情', value: 'DETAIL' },
  { label: '列表查询', value: 'LIST' },
  { label: '分页查询', value: 'PAGE_LIST' },
  { label: '上传', value: 'UPLOAD' },
  { label: '下载', value: 'DOWNLOAD' },
  { label: '导出', value: 'EXPORT' },
  { label: '读取', value: 'READ' },
  { label: '保存', value: 'SAVE' },
  { label: '登录', value: 'LOGIN' },
  { label: '退出', value: 'LOGOUT' },
  { label: '其它', value: 'OTHER' }
])
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'userName',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: '用户名' }
  },
  {
    field: 'ip',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: 'IP地址' }
  },
  {
    field: 'methodName',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: '调用方法名' }
  },
  {
    field: 'module',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: '功能模块' }
  },
  {
    field: 'name',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: '日志名称' }
  },
  {
    field: 'path',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: '请求地址' }
  },
  { field: 'requestMethod', component: 'Input', componentProps: { placeholder: '请求方法' } },
  {
    field: 'operationType',
    component: 'Select',
    formItemProps: {
      style: { width: '180px' }
    },
    componentProps: {
      placeholder: '操作类型',
      options: operationList.value
    }
  },
  {
    field: 'success',
    component: 'Select',
    formItemProps: {
      style: { width: '180px', 'margin-right': '10px' }
    },
    componentProps: {
      placeholder: '是否成功',
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  }
])

const columns = reactive<TableColumn[]>([
  { field: 'index', label: '序号', type: 'index', width: '60px' },
  { field: 'createTime', label: '时间', width: '200px' },
  { field: 'userName', label: '用户名', width: '160px' },
  { field: 'nickName', label: '姓名', width: '100px' },
  { field: 'name', label: '日志名称' },
  { field: 'module', label: '模块' },
  { field: 'operationType', label: '操作类型', width: '' },
  { field: 'ip', label: 'IP', width: '150px' },
  { field: 'className', label: '类名', width: '350px' },
  { field: 'requestMethod', label: '请求方法', width: '100px' },
  { field: 'methodName', label: '方法名称', width: '180px' }
])

const { register, tableObject, methods } = useTable({
  getListApi: listOperationLogApi,
  props: {
    columns
  }
})

tableObject.params = {
  projectId: null,
  userName: null,
  name: null,
  ip: null,
  path: null,
  module: null,
  methodName: null,
  requestMethod: null,
  operationType: null,
  success: null
}

const { getList } = methods

const getOperTagType = (type: string): string => {
  if (type === 'LIST' || type === 'DETAIL' || type === 'READ' || type === 'PAGE_LIST') {
    return 'success'
  } else if (type === 'ADD' || type === 'EDIT' || type === 'UPLOAD' || type === 'SAVE') {
    return 'warning'
  } else if (type === 'DELETE') {
    return 'danger'
  } else {
    return 'info'
  }
}

const getOperationName = (type: string): string => {
  if (type) {
    const operationType = operationList.value.find((item) => item.value === type)
    return operationType.label
  }
  return ''
}

const searchOperationLog = (data: OperationLogQueryType) => {
  tableObject.params = data
  tableObject.params.projectId = appStore.getCurrentProjectId
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
</script>
