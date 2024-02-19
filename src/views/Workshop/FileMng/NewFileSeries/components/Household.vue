<!--居名户-->
<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>
    <div class="line"></div>
    <div class="title-hint"
      ><span class="title-label">居民户档案列表</span> &nbsp;&nbsp;共&nbsp;<span
        class="title-number"
      >
        {{ tableObject.total }} </span
      >&nbsp;份</div
    >
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
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getFileList } from '@/api/fileMng/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const { push } = useRouter()

const { register, tableObject, methods } = useTable({
  getListApi: getFileList
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId,
  type: 'PeasantHousehold'
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCode',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: villageTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: false,
        checkStrictly: false,
        checkOnClickNode: false
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '户号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: '户主姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户主姓名'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'archiveNo',
    label: '文件档号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入文件档号'
      }
    },
    table: {
      show: false
    }
  },
  // table字段 分割
  {
    field: 'index',
    type: 'index',
    label: '序号',
    width: 80
  },
  {
    field: 'villageText',
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  setSearchParams({ ...params })
}

const onReset = () => {
  tableObject.params = {
    projectId,
    type: 'PeasantHousehold'
  }
  setSearchParams({})
}

// 平台采集查看
const handleCollection = (row: any) => {
  console.log('row', row)
  const type = 'household'
  const routeName = 'Household' // 一户一档
<<<<<<< HEAD
=======

>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
  const query = { type }
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
  const type = 'PeasantHousehold'
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

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

onMounted(() => {
  getVillageTree()
  setSearchParams({})
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
