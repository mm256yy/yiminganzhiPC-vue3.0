<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">移民实施</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">居民户信息</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">居民户列表</span>

          <div class="text">
            （共 <span class="num">{{ headInfo.peasantHouseholdNum }}</span> 户
            <span class="distance"></span>
            <span class="num">{{ headInfo.demographicNum }}</span> 人
            <span class="distance"></span>
            已填报<span class="num !text-[#30A952]">{{ headInfo.reportSucceedNum }}</span>
            <span class="distance"></span>
            未填报<span class="num !text-[#FF3030]">{{ headInfo.unReportNum }}</span> ）
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
        <template #doorNo="{ row }">
          {{ filterViewDoorNo(row) }}
        </template>
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
        <template #filling="{ row }">
          <div class="filling-btn" @click="fillData(row)">数据填报</div>
        </template>
        <template #action="{ row }">
          <ElButton link type="primary" @click="onEditRow(row)">编辑</ElButton>
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :row="tableObject.currentRow"
      :districtTree="districtTree"
      @close="onFormPupClose"
      @update-district="onUpdateDistrict"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getLandlordListApi, getLandlordHeadApi } from '@/api/immigrantImplement/common-service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import { locationTypes } from '../DataFill/config'
import { useRouter } from 'vue-router'
import type { LandlordDtoType, LandlordHeadInfoType } from '@/api/workshop/landlord/types'
import { filterViewDoorNo, formatDate } from '@/utils/index'

const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])

const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})

const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

setSearchParams({ type: 'PeasantHousehold', status: 'implementation' })

const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'PeasantHousehold')
  villageTree.value = list || []
  return list || []
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const onUpdateDistrict = () => {
  getVillageTree()
  getdistrictTree()
}

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi({
    type: 'PeasantHousehold',
    status: 'implementation'
  })
  headInfo.value = info
}

onMounted(() => {
  getVillageTree()
  getdistrictTree()
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
        data: districtTree,
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
    field: 'blurry',
    label: '关键字',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '户主或人口/户号/联系方式'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'hasPropertyAccount',
    label: '财产户',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '是',
            value: 'true'
          },
          {
            label: '否',
            value: 'false'
          }
        ]
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
    label: '户主姓名',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户号',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'regionText',
    label: '所属区域',
    search: {
      show: false
    }
  },
  {
    field: 'schedule',
    label: '完成进度',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'hasPropertyAccount',
    label: '财产户',
    search: {
      show: false
    }
  },
  {
    field: 'locationTypeText',
    label: '所属位置',
    search: {
      show: false
    }
  },
  {
    field: 'reportUserName',
    label: '填报人员',
    search: {
      show: false
    }
  },
  {
    field: 'reportDate',
    label: '填报时间',
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'filling',
    label: '填报',
    fixed: 'right',
    width: 115,
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 200,
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

const onEditRow = (row: LandlordDtoType) => {
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

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
  if (!params.status) {
    delete params.status
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      params.type = 'PeasantHousehold'
      setSearchParams({ ...params, status: 'implementation' })
    })
  } else {
    params.type = 'PeasantHousehold'
    setSearchParams({ ...params, status: 'implementation' })
  }
}

// 数据填报
const fillData = (row) => {
  push({
    name: 'immigrantImpDataFill',
    query: {
      householdId: row.id,
      doorNo: row.doorNo,
      type: 'PeasantHousehold',
      projectId: row.projectId,
      uid: row.uid
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
