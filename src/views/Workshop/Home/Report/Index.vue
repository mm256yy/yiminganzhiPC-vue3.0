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
        <ElButton :icon="addIcon" type="primary" @click="onAddRow"> 上传报告 </ElButton>
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
        <div @click="viewOrDownloadFiles(row)">{{ row.name }}</div>
      </template>

      <template #createdDate="{ row }">
        <div>{{ dayjs(row.createdDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </template>

      <template #action="{ row }">
        <span class="txt-btn" @click="onEditRow(row)">编辑</span>
        <span class="txt-btn del" @click="onDelRow(row)">删除</span>
        <span class="txt-btn" @click="downLoad(row)">下载</span>
      </template>
    </Table>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :reportType="(reportType as string)"
      :changeId="(changeId as string)"
      :row="(tableObject.currentRow as any)"
      @close="onFormPupClose"
    />
  </work-content-wrap>
</template>

<script lang="ts" setup>
import { ref, unref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ElBreadcrumb, ElBreadcrumbItem, ElMessageBox, ElSpace, ElButton } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { getReportListApi, delReportByIdApi } from '@/api/workshop/report/service'
import { ReportUpdateType } from '@/api/workshop/report/types'
import EditForm from './components/EditForm.vue'
import dayjs from 'dayjs'

const { currentRoute, back } = useRouter()
const { query } = unref(currentRoute)
const dialog = ref<boolean>(false)
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const title = query.title ? query.title : '报告列表' // 列表标题
const reportType = query.type ? query.type : 'Outline' // 报告类型
const changeId = query.changeId ? query.changeId : '' // 变更设计报告 ID
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const BackIcon = useIcon({ icon: 'iconoir:undo' })
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
    label: '名称',
    search: {
      show: false
    }
  },
  {
    field: 'fileTypeText',
    label: '类型',
    search: {
      show: false
    }
  },
  {
    field: 'content',
    label: '描述',
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

// 上传报告
const onAddRow = () => {
  actionType.value = 'add'
  dialog.value = true
}

// 编辑
const onEditRow = (row: ReportUpdateType) => {
  tableObject.currentRow = row
  actionType.value = 'edit'
  dialog.value = true
}

// 删除
const onDelRow = async (row: ReportUpdateType) => {
  tableObject.currentRow = row
  ElMessageBox.confirm(
    `
			<div style='text-align:center'>
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
        if (reportType === 'ChangeSon') {
          setSearchParams({ type: reportType as string, changeId: changeId })
        } else {
          setSearchParams({ type: reportType as string })
        }
      })
    })
    .catch(() => {})
}

// 下载
const downLoad = (row: ReportUpdateType) => {
  if (row.fileUrl) {
    const fileUrl = JSON.parse(row.fileUrl)
    downLoadFile(fileUrl[0].url, fileUrl[0].name)
  }
}

// 文件下载
const downLoadFile = (url: string, name: string) => {
  const a = document.createElement('a')
  axios.get(url, { responseType: 'blob' }).then((res) => {
    if (!res || !res.data) return
    // 将链接地址字符内容转变成blob地址
    a.href = URL.createObjectURL(res.data)
    a.download = name // 下载文件的名字
    document.body.appendChild(a)
    a.click()

    //在资源下载完成后 清除 占用的缓存资源
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  })
}

// 关闭 新增/编辑 弹框
const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    if (reportType === 'ChangeSon') {
      setSearchParams({ type: reportType as string, changeId: changeId })
    } else {
      setSearchParams({ type: reportType as string })
    }
  }
}

// 预览/下载文件
const viewOrDownloadFiles = (row: ReportUpdateType) => {
  if (row.fileUrl) {
    const fileUrl = JSON.parse(row.fileUrl)
    const url = fileUrl[0].url
    const name = fileUrl[0].name
    if (
      url.indexOf('pdf') !== -1 ||
      url.indexOf('PDF') !== -1 ||
      url.indexOf('png') !== -1 ||
      url.indexOf('PNG') !== -1 ||
      url.indexOf('jpg') !== -1 ||
      url.indexOf('JPG') !== -1 ||
      url.indexOf('gif') !== -1 ||
      url.indexOf('GIF') !== -1
    ) {
      window.open(url)
    } else {
      downLoadFile(url, name)
    }
  }
}

const onBack = () => {
  back()
}

onMounted(() => {
  if (reportType === 'ChangeSon') {
    setSearchParams({ type: reportType as string, changeId: changeId })
  } else {
    setSearchParams({ type: reportType as string })
  }
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
