<!--档案管理详情-->
<template>
  <WorkContentWrap>
    <div class="flex items-center mb-8px">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">档案管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">详情</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <div class="flex items-center justify-between pb-18px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">档案明细</span>
        </div>
        <ElButton type="primary" @click="add">新增</ElButton>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        row-key="id"
        headerAlign="center"
        show-overflow-tooltip
        align="center"
        height="560"
        @register="register"
      >
        <template #pageScope="{ row }">{{ row.pageTop }}页至{{ row.pageLow }}页 </template>
        <template #formDate="{ row }">
          <div>{{ row?.formDate ? dayjs(row?.formDate).format('YYYY-MM-DD') : '--' }}</div>
        </template>
        <template #action="{ row }">
          <ElButton link type="primary" @click="onCheckRow(row)">查看</ElButton>
          <ElButton link type="primary" @click="onEditRow(row)">编辑</ElButton>
          <ElButton link type="primary" @click="onDeleteRow(row)">删除</ElButton>
        </template>
      </Table>
    </div>
    <DetailEdit
      :show="dialogShow"
      :actionType="actionType"
      :pId="pId"
      :pType="type"
      :showDoorNo="showDoorNo"
      :name="name"
      :row="currentRow"
      @close="onClose"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElMessageBox, ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import DetailEdit from './DetailEdit.vue'
import { getFileDetailList, deleteFileDetail } from '@/api/fileMng/service'
import type { DetailUpdateType } from '@/api/fileMng/types'
import dayjs from 'dayjs'

const { currentRoute } = useRouter()
const { type, pId, showDoorNo, name } = currentRoute.value.query as any
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const { register, tableObject, methods } = useTable({
  getListApi: getFileDetailList
})

const { getList, setSearchParams } = methods
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { back } = useRouter()
const dialogShow = ref<boolean>(false)
const actionType = ref<string>('add')
const currentRow = ref<DetailUpdateType>()
const normalTabTypes = ['PeasantHousehold', 'IndividualHousehold', 'Company', 'Village']
let schemas = reactive<any>({
  columns: []
})

const onBack = () => {
  back()
}

tableObject.params = {
  projectId,
  pType: type === 'ProfessionalProject' ? undefined : type,
  pId
}

const getTypeColumns = (type) => {
  let targetList: any = []

  if (type === 'ProfessionalProject') {
    targetList = [
      {
        field: 'index',
        type: 'index',
        label: '序号',
        width: 80
      },
      {
        field: 'name',
        label: '专项名称',
        search: {
          show: false
        }
      },
      {
        field: 'doorNo',
        label: '专项编码',
        search: {
          show: false
        }
      },
      {
        field: 'archiveNo',
        label: '文件档号',
        search: {
          show: false
        }
      },
      {
        field: 'fileTitle',
        label: '题名',
        search: {
          show: false
        }
      },
      {
        field: 'filePage',
        label: '文件页数',
        search: {
          show: false
        }
      },
      {
        field: 'pageScope',
        label: '页码范围',
        search: {
          show: false
        }
      },
      {
        field: 'depositLocation',
        label: '存放位置',
        search: {
          show: false
        }
      },
      {
        field: 'keepTerm',
        label: '保管期限',
        search: {
          show: false
        }
      },
      {
        field: 'dutyPerson',
        label: '责任人',
        search: {
          show: false
        }
      },
      {
        field: 'formDate',
        label: '形成时间',
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
    ]
  } else if (normalTabTypes.includes(type)) {
    // 常规tab
    targetList = [
      {
        field: 'index',
        type: 'index',
        label: '序号',
        width: 80
      },
      {
        field: 'doorNo',
        label: '户号',
        search: {
          show: false
        }
      },
      {
        field: 'name',
        label: '户主姓名',
        search: {
          show: false
        }
      },
      {
        field: 'archiveNo',
        label: '文件档号',
        search: {
          show: false
        }
      },
      {
        field: 'fileTitle',
        label: '题名',
        search: {
          show: false
        }
      },
      {
        field: 'filePage',
        label: '文件页数',
        search: {
          show: false
        }
      },
      {
        field: 'pageScope',
        label: '页码范围',
        search: {
          show: false
        }
      },
      {
        field: 'depositLocation',
        label: '存放位置',
        search: {
          show: false
        }
      },
      {
        field: 'keepTerm',
        label: '保管期限',
        search: {
          show: false
        }
      },
      {
        field: 'dutyPerson',
        label: '责任人',
        search: {
          show: false
        }
      },
      {
        field: 'formDate',
        label: '形成时间',
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
    ]
  } else {
    // 报告及批文
    targetList = [
      {
        field: 'index',
        type: 'index',
        label: '序号',
        width: 80
      },
      {
        field: 'name',
        label: '档案类型',
        search: {
          show: false
        }
      },
      {
        field: 'archiveNo',
        label: '文件档号',
        search: {
          show: false
        }
      },
      {
        field: 'fileTitle',
        label: '题名',
        search: {
          show: false
        }
      },
      {
        field: 'filePage',
        label: '文件页数',
        search: {
          show: false
        }
      },
      {
        field: 'pageScope',
        label: '页码范围',
        search: {
          show: false
        }
      },
      {
        field: 'depositLocation',
        label: '存放位置',
        search: {
          show: false
        }
      },
      {
        field: 'keepTerm',
        label: '保管期限',
        search: {
          show: false
        }
      },
      {
        field: 'dutyPerson',
        label: '责任人',
        search: {
          show: false
        }
      },
      {
        field: 'formDate',
        label: '形成时间',
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
    ]
  }

  return targetList
}

const onClose = () => {
  dialogShow.value = false
  tableObject.params = {
    projectId,
    pType: type,
    pId
  }
  setSearchParams({})
}

// 新增
const add = () => {
  dialogShow.value = true
  actionType.value = 'add'
}

// 查看
const onCheckRow = (row: any) => {
  const urlList = JSON.parse(row?.personPic)
  if (urlList?.length <= 0) {
    ElMessage.error('文件不存在')
    return
  }
  window.open(urlList[0].url)
}

// 编辑
const onEditRow = (row: any) => {
  actionType.value = 'edit'
  currentRow.value = row
  dialogShow.value = true
}

// 删除
const onDeleteRow = (row: any) => {
  ElMessageBox.confirm(`确定要删除该行数据吗？`)
    .then(async () => {
      await deleteFileDetail(row.id ?? 0)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const assembleSchemas = () => {
  let allData = useCrudSchemas(getTypeColumns(type))
  schemas.columns = allData.allSchemas.tableColumns
}

onMounted(() => {
  setSearchParams({})
  assembleSchemas()
})

// requestList()
</script>
<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  justify-content: space-between;
}

.table-wrap {
  margin-top: 0;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}

.title-hint {
  padding: 15px 0 5px 15px;
  font-size: 14px;
  color: 14px;

  .title-label {
    font-weight: bold;
    color: #333;
    font-size: 16px;
  }

  .title-number {
    font-size: 16px;
    color: #1890ff;
    font-weight: bold;
  }
}

:deep(.el-table .el-table__cell) {
  padding: 5px 0;
}
</style>
