<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">档案管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'doorNo'"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">个体户列表</span>
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            共 <span class="num">{{ tableObject.total }}</span> 家个体工商
          </div>
        </div>
      </div>
      <Table
        selection
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
        <template #regionText="{ row }">
          <div>
            {{
              `
              ${row.cityCodeText ? row.cityCodeText + '/' : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? '/' + row.townCodeText : ''}
              ${row.villageText ? '/' + row.villageText : ''}
              ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
              `
            }}
          </div>
        </template>
        <template #locationType="{ row }">
          <div>{{ getLocationText(row.locationType) }}</div>
        </template>
        <template #hasPropertyAccount="{ row }">
          <div>{{ row.hasPropertyAccount ? '是' : '否' }}</div>
        </template>
        <template #reportDate="{ row }">
          <div>{{ formatDate(row.reportDate) }}</div>
        </template>
        <template #action="{ row }">
          <ElButton type="primary" link @click="onCheckRow(row)">查看档案</ElButton>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getLandlordListApi, getLandlordHeadApi } from '@/api/immigrantImplement/common-service'
import { screeningTree } from '@/api/workshop/village/service'
import { locationTypes } from '../DataFill/config'
import { useRouter } from 'vue-router'
import type { LandlordHeadInfoType } from '@/api/workshop/landlord/types'
import { formatDate } from '@/utils/index'

const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])

const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})

const { setSearchParams } = methods

tableObject.params = {
  projectId
}

setSearchParams({ type: 'IndividualHousehold', status: 'implementation' })

const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'IndividualHousehold')
  villageTree.value = list || []

  return list || []
}

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi({ type: 'IndividualHousehold' })
  headInfo.value = info
}

onMounted(() => {
  getVillageTree()
  getLandlordHeadInfo()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
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
        showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: '个体户名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '个体户名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '个体工商编码',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入编码'
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
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '个体户名称',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '编码',

    search: {
      show: false
    }
  },
  {
    field: 'legalPersonName',
    label: '法人姓名',
    search: {
      show: false
    }
  },
  {
    field: 'regionText',
    label: '所属区域',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 120,
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

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  if (!data.fillStatus) {
    Reflect.deleteProperty(params, 'fillStatus')
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  if (!params.hasPropertyAccount) {
    delete params.hasPropertyAccount
  }

  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }

      params.type = 'IndividualHousehold'
      setSearchParams({ ...params, status: 'implementation' })
    })
  } else {
    params.type = 'IndividualHousehold'
    setSearchParams({ ...params, status: 'implementation' })
  }
}

// 查看档案
const onCheckRow = (row) => {
  push({
    name: 'FileMngCheck',
    query: {
      householdId: row.id,
      doorNo: row.doorNo,
      type: 2
    }
  })
}
</script>

<style lang="less" scoped>
.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}
</style>
