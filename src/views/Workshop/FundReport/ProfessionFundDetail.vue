<!-- 资金发放明细 -->
<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">专业项目</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金发放明细</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>

    <div class="line"></div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 资金发放明细统计表</div>
        <ElButton type="primary" @click="onExport">数据导出</ElButton>
      </div>
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
        headerAlign="center"
        align="center"
        height="600"
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getProfessionalProjectsPageApi,
  exportFundProfessionProjectApi
} from '@/api/workshop/dataQuery/populationHousing-service'
import { PopulationHousingDtoType } from '@/api/workshop/dataQuery/populationHousing-types'
import { screeningTree } from '@/api/workshop/village/service'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { useDictStoreWithOut } from '@/store/modules/dict'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { back } = useRouter()

interface SpanMethodProps {
  row: PopulationHousingDtoType
  column: PopulationHousingDtoType
  rowIndex: number
  columnIndex: number
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { register, tableObject, methods } = useTable({
  getListApi: getProfessionalProjectsPageApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId,
  type: 23
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
    field: 'type',
    label: '专项类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: dictObj.value[342]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'code',
    label: '专项编码',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入专项编码'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: '专项名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入专项编码'
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
    width: 80,
    search: {
      show: false
    }
  },
  {
    field: 'area',
    label: '所属区域',
    search: {
      show: false
    }
  },
  {
    field: 'typeText',
    label: '专项类别',
    search: {
      show: false
    }
  },
  {
    field: 'code',
    label: '专项编码',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '项目名称',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'underlyingCompany',
    label: '权属单位名称',
    search: {
      show: false
    }
  },
  {
    field: 'responsibilityCompany',
    label: '责任单位',
    search: {
      show: false
    }
  },
  {
    field: 'designCompany',
    label: '设计单位',
    search: {
      show: false
    }
  },
  {
    field: 'supervisionCompany',
    label: '监理单位',
    search: {
      show: false
    }
  },
  {
    field: 'startDate',
    label: '合同开始时间',
    search: {
      show: false
    }
  },
  {
    field: 'endDate',
    label: '合同终止时间',
    search: {
      show: false
    }
  },
  {
    field: 'contractAmount',
    label: '合同金额(元)',
    search: {
      show: false
    }
  },
  {
    field: 'payAmount',
    label: '已付金额(元)',
    search: {
      show: false
    }
  },
  {
    field: 'unPayAmount',
    label: '待付金额(元)',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const onBack = () => {
  back()
}

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

  // 需要重置一次params
  tableObject.params = {
    projectId,
    type: 23
  }

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  setSearchParams({ ...params })
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params
  }
  const res = await exportFundProfessionProjectApi(params)
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

const onReset = () => {
  tableObject.params = {
    projectId,
    type: 23
  }
  setSearchParams({})
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
</style>
