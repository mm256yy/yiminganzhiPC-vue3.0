<!--只征地不搬迁进度明细报表-->
<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
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
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 只征地不搬迁进度明细报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
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
        :summary-method="getSummaries"
        show-summary
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #landSeedlingStatus="{ row }">
          <div v-if="row.landSeedlingStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #productionArrangementStatus="{ row }">
          <div v-if="row.productionArrangementStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #landSoarStatus="{ row }">
          <div v-if="row.landSoarStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #agreementStatus="{ row }">
          <div v-if="row.agreementStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #cardStatus="{ row }">
          <div v-if="row.cardStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #selfEmploymentStatus="{ row }">
          <div v-if="row.selfEmploymentStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #retirementStatus="{ row }">
          <div v-if="row.retirementStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { ElButton } from 'element-plus'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import {
  getLandNoMoveProgressDetailListApi,
  exportLandNoMoveProgressDetailListApi
} from '@/api/workshop/scheduleReport/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
import { screeningTree } from '@/api/workshop/village/service'

const titles = ['智能报表', '进度管理', '只征地不搬迁', '进度明细']
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])
const totalCountObj = ref<any>() // 总计对象

const { register, tableObject } = useTable()

const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'villageCode',
    label: '权属单位',
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
  // table 字段定义
  {
    field: 'index',
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    field: 'villageCodeText',
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
    field: 'landSeedlingStatus',
    label: '资产评估',
    search: {
      show: false
    }
  },
  {
    field: 'productionArrangementStatus',
    label: '生产安置确认',
    search: {
      show: false
    }
  },
  {
    field: 'landSoarStatus',
    label: '土地腾让',
    search: {
      show: false
    }
  },
  {
    field: 'agreementStatus',
    label: '征地协议',
    search: {
      show: false
    }
  },
  {
    field: 'cardStatus',
    label: '补偿卡',
    search: {
      show: false
    }
  },
  {
    field: 'selfEmploymentStatus',
    label: '自谋职业',
    search: {
      show: false
    }
  },
  {
    field: 'retirementStatus',
    label: '养老保险',
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

  tableObject.params = params
  getTableList()
}

const onReset = () => {
  tableObject.params = {
    projectId
  }
  getTableList()
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params,
    type: 'LandNoMove'
  }
  const res = await exportLandNoMoveProgressDetailListApi(params)
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

const getTableList = async () => {
  tableObject.loading = true
  const params = {
    ...tableObject.params,
    size: tableObject.size,
    page: tableObject.currentPage - 1
  }
  try {
    const res = await getLandNoMoveProgressDetailListApi(params)
    if (res) {
      // 赋值表格数据
      tableObject.total = res.total
      tableObject.tableList = res.content || []
      totalCountObj.value = res.other || {}
      tableObject.loading = false
    }
  } catch {
    tableObject.loading = false
    tableObject.total = 0
  }
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

const getSummaries = (params: any) => {
  const { columns } = params
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (index < 4) {
      sums[index] = ''
      return
    }
    console.log(column)
    if (!totalCountObj.value) {
      return
    }
    const totalMap = {
      4: totalCountObj.value.landSeedlingStatusTotal, // 资产评估总计
      5: totalCountObj.value.productionArrangementStatusTotal, // 生产安置确认总计
      6: totalCountObj.value.landSoarStatusTotal, // 土地腾让总计
      7: totalCountObj.value.agreementStatusTotal, // 征地协议总计
      8: totalCountObj.value.cardStatusTotal, // 补偿卡总计
      9: totalCountObj.value.selfEmploymentStatusTotal, // 自谋职业总计
      10: totalCountObj.value.retirementStatusTotal // 养老保险总计
    }
    sums[index] = totalMap[index]
    return
  })
  return sums
}

onMounted(() => {
  getVillageTree()
  getTableList()
})

watch(
  () => tableObject.currentPage,
  () => {
    getTableList()
  }
)

watch(
  () => tableObject.size,
  () => {
    // 当前页不为1时，修改页数后会导致多次调用getList方法
    if (tableObject.currentPage === 1) {
      getTableList()
    } else {
      tableObject.currentPage = 1
      getTableList()
    }
  }
)
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
  font-size: 14px;
  color: 14px;
}

:deep(.el-table .el-table__cell) {
  padding: 5px 0;
}
</style>
