<template>
  <work-content-wrap>
    <ElBreadcrumb separator="/" class="flex items-center">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        type="default"
        class="px-9px py-0px !h-28px mr-8px !text-12px"
      >
        返回
      </ElButton>
      <ElBreadcrumbItem class="text-size-12px">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">报告上传</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="title-wrapper">
      <div class="text-size-14px"> {{ title }} </div>
      <ElSpace>
        <ElButton :icon="addIcon" type="primary" @click="onAddRow"> 设计变更报告 </ElButton>
      </ElSpace>
    </div>

    <Table
      v-model:pageSize="tableObject.size"
      v-model:currentPage="tableObject.currentPage"
      :pagination="{
        total: tableObject.total
      }"
      :loading="tableObject.loading"
      :data="tableObject.tableList"
      :columns="allSchemas.tableColumns"
      row-key="id"
      headerAlign="center"
      align="center"
      highlightCurrentRow
      @register="register"
    >
      <template #name="{ row }">
        <div class="name" @click="toLink(row)">{{ row.name }}</div>
      </template>

      <template #changeTime="{ row }">
        <div>{{ formatDate(row.changeTime) }}</div>
      </template>

      <template #createdDate="{ row }">
        <div>{{ formatDate(row.createdDate) }}</div>
      </template>

      <template #action="{ row }">
        <span class="txt-btn" @click="onEditRow(row)">编辑</span>
        <span class="txt-btn del" @click="onDelRow(row)">删除</span>
      </template>
    </Table>

    <EditForm
      :show="dialog"
      :action-type="actionType"
      :report-type="reportType as string"
      :row="tableObject.currentRow as any"
      @close="onFormPupClose"
    />
  </work-content-wrap>
</template>

<script lang="ts" setup>
import { ref, unref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ElBreadcrumb, ElBreadcrumbItem, ElMessageBox, ElSpace, ElButton } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { getReportListApi, delReportByIdApi } from '@/api/workshop/report/service'
import { ReportUpdateType } from '@/api/workshop/report/types'
import { formatDate } from '@/utils/index'
import EditForm from './components/EditForm.vue'

const { currentRoute, back } = useRouter()
const { query } = unref(currentRoute)
const dialog = ref<boolean>(false)
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const reportType = query.type ? query.type : 'Change' // 报告类型
const title = query.title ? query.title : '报告列表' // 列表标题
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { push } = useRouter()
const appStore = useAppStore()
const projectId = appStore.currentProjectId // 项目 ID
const { register, tableObject, methods } = useTable({
  getListApi: getReportListApi,
  delListApi: delReportByIdApi
})
const { setSearchParams } = methods

tableObject.params = {
  projectId
}

const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '变更名称',
    search: {
      show: false
    }
  },
  {
    field: 'changeTime',
    label: '变更时间',
    search: {
      show: false
    }
  },
  {
    field: 'changeTypeText',
    label: '变更类型',
    search: {
      show: false
    }
  },
  {
    field: 'content',
    label: '变更描述',
    search: {
      show: false
    }
  },
  {
    field: 'createdName',
    label: '上传人',
    search: {
      show: false
    }
  },
  {
    field: 'createdDate',
    label: '上传时间',
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const onAddRow = () => {
  actionType.value = 'add'
  dialog.value = true
}

// 编辑
const onEditRow = (row: ReportUpdateType) => {
  tableObject.currentRow = {
    ...row,
    changeDate: row.changeTime ? formatDate(row.changeTime) : ''
  }
  actionType.value = 'edit'
  dialog.value = true
}

// 删除
const onDelRow = async (row: ReportUpdateType) => {
  tableObject.currentRow = row
  ElMessageBox.confirm(
    `
			<div style='text-align:center'>
				<div><strong>${row.name} 下有${row.sonNumber}个文件</strong></div>
				<div>是否删除 <strong>${row.name}</strong></div>
			</div>
		`,
    '删除提示',
    {
      dangerouslyUseHTMLString: true,
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }
  )
    .then(() => {
      delReportByIdApi(tableObject.currentRow?.id as number).then(() => {
        setSearchParams({ type: reportType as string })
      })
    })
    .catch(() => {})
}

// 跳转至子项列表
const toLink = (row: ReportUpdateType) => {
  push(`/workshop/report?changeId=${row.id}&type=ChangeSon`)
}

// 关闭 新增/编辑 弹框
const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    setSearchParams({ type: reportType as string })
  }
}

const onBack = () => {
  back()
}

onMounted(() => {
  setSearchParams({ type: reportType as string })
})
</script>

<style lang="less" scoped>
.title-wrapper {
  display: flex;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background: #fff;
  border-radius: 3px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
}

.name {
  color: #3e73ec;
  cursor: pointer;
}

.txt-btn {
  margin-right: 8px;
  font-size: 12px;
  color: #3e73ec;
  cursor: pointer;

  &.del {
    color: #f56c6c;
  }
}
</style>
