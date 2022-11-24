<template>
  <ContentWrap title="登录日志">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="searchLoginLog" />
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
          <template #type="{ row }">
            <el-tag :type="row.type === 1 ? '' : 'warning'">{{ getType(row.type) }}</el-tag>
          </template>
          <template #action="{ row }">
            <ElButton type="primary" text @click="onShowDetail(row)">详情</ElButton>
          </template>
        </Table>
      </ContentWrap>
    </div>
    <Detail v-if="showDetail" :row="currentRow" :show="showDetail" @close="onCloseDetail" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessageBox, ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { TableColumn } from '@/types/table'
import { FormSchema } from '@/types/form'
import { LoginLogInfoType, LoginLogQueryType } from '@/api/audit/login/types'
import { listLoginLogApi } from '@/api/audit/login'
import { Detail } from './components'
import { formatDateTime } from '@/utils'

const appStore = useAppStore()
const showDetail = ref(false)
const currentRow = ref<LoginLogInfoType>()

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
    field: 'city',
    component: 'Input',
    formItemProps: {
      style: { width: '200px', 'margin-right': '10px' }
    },
    componentProps: { placeholder: '所在城市' }
  },
  {
    field: 'type',
    component: 'Select',
    formItemProps: {
      style: { width: '160px', 'margin-right': '10px' }
    },
    componentProps: {
      placeholder: '登录/退出',
      options: [
        { label: '登录', value: 1 },
        { label: '退出', value: 2 }
      ]
    }
  },
  {
    field: 'success',
    component: 'Select',
    formItemProps: {
      style: { width: '160px' }
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
  { field: 'createTime', label: '时间' },
  { field: 'userName', label: '用户名' },
  { field: 'type', label: '类型', width: '60px' },
  { field: 'platformName', label: '平台名称' },
  { field: 'osName', label: '系统名称', width: '280px' },
  { field: 'ip', label: 'IP', width: '200px' },
  { field: 'code', label: '响应码', width: '100px' },
  { field: 'browserName', label: '浏览器' },
  { field: 'browserVersion', label: '浏览器版本', width: '100px' },
  { field: 'action', label: '操作', width: '100px', align: 'center' }
])

const { register, tableObject, methods } = useTable({
  getListApi: listLoginLogApi,
  props: {
    columns
  }
})

tableObject.params = {
  userName: null,
  ip: null,
  city: null,
  type: null,
  success: null
}

const { getList } = methods

const getType = (val: number): string => {
  if (val === 1) {
    return '登录'
  } else if (val === 2) {
    return '退出'
  } else {
    return '未知'
  }
}

const searchLoginLog = (data: LoginLogQueryType) => {
  tableObject.params.userName = data.userName
  tableObject.params.ip = data.ip
  tableObject.params.city = data.city
  tableObject.params.type = data.type
  tableObject.params.success = data.success
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

const onShowDetail = (row: LoginLogInfoType) => {
  currentRow.value = row
  showDetail.value = true
}

const onCloseDetail = () => {
  showDetail.value = false
}
</script>
