<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">付款申请</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">付款申请记录</span>

          <div class="text">
            已完成：{{ 1 }}笔 <span class="num">{{ 1000 }}</span> 元
          </div>
          <div class="text">
            审核中：{{ 1 }}笔 <span class="num">{{ 1000 }}</span> 元
          </div>
          <div class="text">
            待提交：{{ 1 }}笔 <span class="num">{{ 1000 }}</span> 元
          </div>
        </div>
        <ElSpace>
          <ElButton type="primary" @click="onAddRow"> 申请 </ElButton>
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
        <template #createdDate="{ row }">
          <div>{{ formatDate(row.createdDate) }}</div>
        </template>

        <template #age="{ row }">
          <div>{{ analyzeIDCard(row.card) }}</div>
        </template>

        <!-- <template #action="{ row }">
          <TableEditColumn :view-type="'link'" :row="row" @delete="onDelRow" @edit="onEditRow" />
        </template> -->
        <template #action="{ row }">
          <el-button type="primary" link @click="onViewRow(row)">查看</el-button>
          <el-button type="primary" link @click="onEditRow(row)">编辑</el-button>
          <el-button v-if="row.relation != 1" type="danger" link> 删除 </el-button>
        </template>
      </Table>
    </div>

    <EditForm :show="dialog" @close="onEditFormClose" :actionType="actionType" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElSpace, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
// import { useIcon } from '@/hooks/web/useIcon'
import {
  getDemographicListApi,
  delDemographicByIdApi,
  getDemographicHeadApi,
  getExcelList
} from '@/api/workshop/population/service'
// import type {
//   DemographicDtoType,
//   DemographicHeadType,
//   ExcelListType
// } from '@/api/workshop/population/types'
import type { DemographicHeadType, ExcelListType } from '@/api/workshop/population/types'
// import dayjs from 'dayjs'
import { formatDate, analyzeIDCard } from '@/utils/index'
import EditForm from './EditForm.vue'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const villageTree = ref<any[]>([])
const headInfo = ref<DemographicHeadType>({
  demographicNum: 0,
  peasantHouseholdNum: 0
})

const excelList = ref<ExcelListType[]>([])
const actionType = ref<'view' | 'add' | 'edit'>('add')
const dialog = ref<boolean>(false)

let timer = 0

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getDemographicHeadInfo = async () => {
  const info = await getDemographicHeadApi()
  headInfo.value = info
}

const getExcelUploadList = async () => {
  const res = await getExcelList()
  if (res && res.content) {
    excelList.value = res.content
  }
}

onMounted(() => {
  getDemographicHeadInfo()
  getExcelUploadList()
})

onBeforeUnmount(() => {
  clearInterval(timer)
  timer = 0
})

// const onDelRow = async (row: any, multiple: boolean) => {
//   tableObject.currentRow = row
//   const { delList, getSelections } = methods
//   const selections = await getSelections()
//   await delList(
//     multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
//     multiple
//   )
// }

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = (row: any) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}
const onViewRow = (row: any) => {
  actionType.value = 'view'
  //   tableObject.currentRow = {
  //     ...row,
  //     occupation: row.occupation ? JSON.parse(row.occupation) : '',
  //     insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  //   }
  tableObject.currentRow = row
  dialog.value = true
}
const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '申请类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '1',
            value: 1
          }
        ]
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
    field: 'relationText',
    label: '状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '1',
            value: 1
          }
        ]
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
    field: 'name',
    label: '申请名称',
    search: {
      show: true,
      component: 'Input'
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
    field: 'relationText',
    label: '申请时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
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
    field: 'price',
    label: '申请金额',
    search: {
      show: true,
      component: 'InputRange'
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
    field: 'relationText',
    label: '概算科目',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '1',
            value: 1
          }
        ]
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
    field: 'relationText',
    label: '资金科目',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '1',
            value: 1
          }
        ]
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
    field: 'name',
    label: '申请人',
    search: {
      show: true,
      component: 'Input'
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
    field: 'relationText',
    label: '付款对象类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '1',
            value: 1
          }
        ]
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
  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    width: 160,
    field: 'name',
    label: '付款编号',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'relationText',
    label: '申请名称',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'sexText',
    label: '付款对象类型',
    search: {
      show: false
    }
  },
  {
    width: 200,
    field: 'age',
    label: '概算科目',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'card',
    label: '资金科目',
    search: {
      show: false
    }
  },
  {
    field: 'nationText',
    label: '资金金额（元）',
    search: {
      show: false
    }
  },
  {
    field: 'nationText',
    label: '申请类别',
    search: {
      show: false
    }
  },
  {
    field: 'nationText',
    label: '创建时间',
    search: {
      show: false
    }
  },
  {
    field: 'nationText',
    label: '申请人',
    search: {
      show: false
    }
  },

  {
    width: 100,
    field: 'censusRegister',
    label: '状态',
    search: {
      show: false
    }
  },
  {
    width: 200,
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

const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData)

  if (searchData.relation == '1') {
    searchData.relation = ['is', 1]
  } else if (searchData.relation == '0') {
    searchData.relation = ['not', 1]
  } else {
    delete searchData.relation
  }

  // 处理参数
  let params = {
    ...searchData
  }
  tableObject.params = {
    projectId
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      delete params.code
      setSearchParams({ ...params })
    })
  } else {
    delete params.code
    setSearchParams({ ...params })
  }
}

const onEditFormClose = (flag: boolean) => {
  if (flag) {
    getList()
  }
  dialog.value = false
}
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}
</style>
