<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">移民实施</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">只征地不搬迁</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="setSearchParams"
        :valueForme="valueForme['居民户信息']"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">户列表</span>

          <div class="text">
            （共 <span class="num">{{ tableObject.total }}</span> 户
            <span class="distance"></span>）
          </div>
        </div>
        <!-- <ElSpace>
          <ElButton type="primary">导出列表</ElButton>
        </ElSpace> -->
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
        <!-- <template #hasPropertyAccount="{ row }">
          <div>{{ row.hasPropertyAccount ? '是' : '否' }}</div>
        </template>
        <template #reportDate="{ row }">
          <div>{{ formatDate(row.reportDate) }}</div>
        </template> -->
        <template #currentProgress="{ row }">
          <div>{{ row.currentProgress }}</div>
        </template>
        <template #filling="{ row }">
          <div class="filling-btn" @click="fillData(row)">数据填报</div>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getLandNoMoveApi } from '@/api/immigrantImplement/common-service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import { locationTypes } from '../DataFill/config'
import { useRouter } from 'vue-router'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import { filterViewDoorNo } from '@/utils/index'
import { useDictStoreWithOut } from '@/store/modules/dict'

const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
let valueForme = appStore.getsercher
const dialog = ref(false) // 弹窗标识
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const { currentRoute } = useRouter()
const { search } = currentRoute.value.query as any // 从搜索入口取值

const { register, tableObject, methods } = useTable({
  getListApi: getLandNoMoveApi
})
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId,
  blurry: search,
  ...valueForme['居民户信息']
}

setSearchParams({
  completeStatus: currentRoute.value.query['warnStatus'],
  status: 'implementation'
})

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

onMounted(() => {
  getVillageTree()
  getdistrictTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '所在区域',
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
        placeholder: '使用权人，户号或联系方式'
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
    field: 'area',
    label: '所在区域',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[326]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'inundationRange',
    label: '淹没范围',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[346]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'landUserType',
    label: '类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[418]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
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
    label: '使用权人',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
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
    field: 'landUserTypeText',
    label: '类别',
    width: 100,
    search: {
      show: false
    }
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
const maps = {
  Country: 'areaCode',
  Township: 'townCode',
  Village: 'villageCode', // 行政村 code
  NaturalVillage: 'virutalVillageCode' // 自然村 code
}
const onSearch = (data) => {
  console.log('======================================')
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData)
  // 处理参数
  let params = {
    ...searchData
  }

  // 需要重置一次params
  // tableObject.params = {
  //   projectId
  // }
  if (!params.hasPropertyAccount) {
    delete params.hasPropertyAccount
  }
  if (!params.status) {
    delete params.status
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(districtTree.value, params.code, (item) => {
      console.log(item)

      if (item) {
        let m = maps
        params[getParamsKey(item.districtType)] = params.code
        delete m[item.districtType]
        for (const key in m) {
          params[m[key]] = ''
        }
      }
    })
    tableObject.params = params

    setSearchParams({ ...params, status: 'implementation' })
  } else {
    setSearchParams({ ...params, status: 'implementation' })
  }
}

// 数据填报
const fillData = (row) => {
  push({
    name: 'ImmigrantImpDataFill',
    query: {
      householdId: row.id,
      doorNo: row.doorNo,
      type: 'LandNoMove',
      nowbody: row.landUserType
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
