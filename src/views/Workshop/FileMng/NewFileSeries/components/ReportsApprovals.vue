<!--报告及批文-->
<template>
  <WorkContentWrap>
    <div class="line"></div>
    <div class="title-hint"><span class="title-label">报告及批文列表</span></div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <Table
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        show-overflow-tooltip
        align="center"
        style="max-height: 1000px"
      >
        <template #collection="{ row }">
          <ElButton size="small" type="primary" text @click="handleCollection(row)"
            >平台采集</ElButton
          >
        </template>
        <template #archiving="{ row }">
          <ElButton size="small" type="primary" text @click="handleArchiving(row)"
            >电子档案（已上传{{ row?.docNum }}份）</ElButton
          >
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getApprovalList } from '@/api/fileMng/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const { push } = useRouter()
const { tableObject } = useTable()
tableObject.params = {
  projectId
}

const schema = reactive<CrudSchema[]>([
  // table字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
    width: 100
  },
  {
    field: 'name',
    label: '报告类别',
    search: {
      show: false
    }
  },
  {
    field: 'collection',
    label: '平台采集查看',
    search: {
      show: false
    }
  },
  {
    field: 'archiving',
    label: '档案归档',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const handleCollection = (row: any) => {
  const type = row.type
  const title = row.name
  const routeName = 'workshopReport' // 报告及批文
  const query = { type, title }
  try {
    push({
      name: routeName,
      query
    })
  } catch (err) {
    ElMessage.error('该角色缺少相关配置路由页面')
  }
}

// 查看电子档案
const handleArchiving = (row: any) => {
  const routeName = 'FileMngDetail'
  const type = row.type
  const showDoorNo = row.showDoorNo
  const name = row.name
  const query = {
    type,
    pId: row.id,
    showDoorNo,
    name
  }
  try {
    push({
      name: routeName,
      query
    })
  } catch (err) {
    ElMessage.error('该角色缺少相关配置路由页面')
  }
}

const requestListApi = async () => {
  tableObject.loading = true
  try {
    const res = await getApprovalList(tableObject.params)
    tableObject.tableList = res || []
    tableObject.loading = false
  } catch {
    tableObject.loading = false
    tableObject.tableList = []
  }
}

onMounted(() => {
  requestListApi()
})
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
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .title-number {
    font-size: 16px;
    font-weight: bold;
    color: #1890ff;
  }
}

:deep(.el-table .el-table__cell) {
  padding: 5px 0;
}
</style>
