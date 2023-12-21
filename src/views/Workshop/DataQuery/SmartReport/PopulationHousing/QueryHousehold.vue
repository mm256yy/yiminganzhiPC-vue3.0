<!--按户查询-->
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
      <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
    </div>

    <div class="line"></div>
    <div class="title-hint">人口房屋统计表（按户查询）</div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        :span-method="objectSpanMethod"
        row-key="id"
        height="460"
        :max-height="460"
        style="width: 100%"
        headerAlign="center"
        align="center"
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getPopulationHousingListApi,
  exportReportApi
} from '@/api/workshop/dataQuery/populationHousing-service'
import { PopulationHousingDtoType } from '@/api/workshop/dataQuery/populationHousing-types'
import { screeningTree } from '@/api/workshop/village/service'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

interface SpanMethodProps {
  row: PopulationHousingDtoType
  column: PopulationHousingDtoType
  rowIndex: number
  columnIndex: number
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])

const { register, tableObject, methods } = useTable({
  getListApi: getPopulationHousingListApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId,
  status: SurveyStatusEnum.Implementation
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
    field: 'householdName',
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

  // table字段 分割
  {
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'area',
    label: '行政村',
    width: 180,
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
    field: 'householdName',
    label: '户主',
    search: {
      show: false
    }
  },
  {
    field: '',
    label: '人口(人)',
    search: {
      show: false
    },
    children: [
      {
        field: 'inCount',
        label: '册内人口',
        search: {
          show: false
        }
      },
      {
        field: 'outCount',
        label: '册外人口',
        search: {
          show: false
        }
      },
      {
        field: 'sumCount',
        label: '合计',
        search: {
          show: false
        }
      }
    ]
  },
  {
    field: 'houseNo',
    label: '幢号',
    search: {
      show: false
    }
  },
  {
    field: 'storeyNumber',
    label: '层数',
    search: {
      show: false
    }
  },
  {
    field: 'constructionTypeText',
    label: '结构类型',
    search: {
      show: false
    }
  },
  {
    field: 'landArea',
    label: '房屋建筑面积(㎡)',
    search: {
      show: false
    }
  },
  {
    field: 'locationTypeText',
    label: '所在位置',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

/**
 * 合并单元行
 * @param{Object} row 当前行
 * @param{Object} column 当前列
 * @param{Object} rowIndex 当前行下标
 * @param{Object} columnInex 当前列下标
 */
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  const num = tableObject.tableList.filter(
    (item: any) => item.householdName === row.householdName && item.doorNo === row.doorNo
  ).length
  const index = tableObject.tableList.findIndex(
    (item: any) => item.householdName === row.householdName && item.doorNo === row.doorNo
  )
  if (column && columnIndex < 5) {
    if (index === rowIndex) {
      return {
        rowspan: num,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

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
    projectId
  }
  setSearchParams({})
}

// 数据导出
const onExport = async () => {
  const params = {
    exportType: '1',
    ...tableObject.params
  }
  const res = await exportReportApi(params)
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

// 递归查找
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
  padding: 15px 0 0 15px;
  color: 14px;
}
</style>
