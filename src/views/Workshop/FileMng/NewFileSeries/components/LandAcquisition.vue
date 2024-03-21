<!--只征地不搬迁-->
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
      ><span class="title-label">只征地不搬迁列表</span> &nbsp;&nbsp;共&nbsp;<span
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
        @register="register"
      >
        <template #ownership="{ row }">
          {{
            `
              ${row.cityCodeText ? row.cityCodeText : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? row.townCodeText : ''}
              ${row.villageText ? row.villageText : ''}
              ${row.virutalVillageText ? row.virutalVillageText : ''}
              `
          }}
        </template>
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
import { ElButton } from 'element-plus'
import { getFileList } from '@/api/fileMng/service'
import { getDistrictTreeApi } from '@/api/district'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const { register, tableObject, methods } = useTable({
  getListApi: getFileList
})
const { setSearchParams } = methods
const districtTree = ref<any[]>([])
const { push } = useRouter()

tableObject.params = {
  projectId,
  type: 'landNoMove'
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '权属单位',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: districtTree,
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
    field: 'doorNo',
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
    label: '使用权人',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用权人'
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
  // table字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
    width: 80
  },
  {
    field: 'ownership',
    label: '权属单位',
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
    label: '使用权人',
    search: {
      show: false
    }
  },
  {
    field: 'landUserTypeText',
    label: '类别',
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
const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  params[getParamsKey('Country')] = null
  params[getParamsKey('Township')] = null
  params[getParamsKey('Village')] = null
  params[getParamsKey('NaturalVillage')] = null

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  if (params.code) {
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
    })
    delete params.code
  }

  setSearchParams({ ...params })
}

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

const onReset = () => {
  tableObject.params = {
    projectId,
    type: 'landNoMove'
  }
  setSearchParams({})
}

// 平台采集查看
const handleCollection = (row: any) => {
  const type = 5
  const routeName = 'FileMngCheck' // 企业
  const query = {
    householdId: row.id,
    doorNo: row.doorNo,
    type
  }
  try {
    push({
      name: routeName,
      query
    })
  } catch (err) {
    console.log(err)
    ElMessage.error('该角色缺少相关配置路由页面')
  }
}

// 查看电子档案
const handleArchiving = (row: any) => {
  const routeName = 'FileMngDetail'
  const type = 'landNoMove'
  const query = {
    type,
    pId: row.id
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

// 获取区域树
const getdistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

onMounted(() => {
  getdistrictTree()
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
