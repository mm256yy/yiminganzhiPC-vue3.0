<!--报告及批文-->
<template>
  <WorkContentWrap>
    <div class="line"></div>
    <div class="title-hint"><span class="title-label">报告及批文列表</span></div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        style="width: 100%"
        headerAlign="center"
        show-overflow-tooltip
        align="center"
        height="560"
        @register="register"
      >
        <template #collection="{ row }">
          <ElButton size="small" type="primary" text @click="handleCollection(row)"
            >平台采集</ElButton
          >
        </template>
        <template #archiving>
          <ElButton size="small" type="primary" text>电子档案</ElButton>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { ElButton } from 'element-plus'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])

const { register, tableObject, methods } = useTable({})

const villageTree = ref<any[]>([])

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
    field: 'villageCodeText',
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

const handleCollection = (row: any) => {}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

const requestList = () => {
  try {
    tableObject.tableList = [
      {
        villageCodeText: '西山村',
        showDoorNo: '10010',
        householdName: '张三'
      }
    ]
    tableObject.loading = false
  } catch {}
}

requestList()

onMounted(() => {
  getVillageTree()
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
