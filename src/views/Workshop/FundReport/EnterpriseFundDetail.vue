<!--企事业单位资金发放明细-->
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
        <div class="table-left-title"> 资金使用报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        :showOverflowTooltip="true"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
        height="600"
      >
        <template #action="{ row }">
          <ElButton size="small" type="primary" link @click="handleClickItem(row)">
            查看详情
          </ElButton>
        </template>
      </Table>
    </div>
    <HouseholdEdit :show="dialog" @close="onFormPupClose" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { ElButton } from 'element-plus'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getFundDetailReportListApi } from '@/api/fundReport/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
import HouseholdEdit from './components/HouseholdEdit.vue'
import { screeningTree } from '@/api/workshop/village/service'

const titles = ['智能报表', '资金管理', '企(事)业单位', '企业资金发放明细']
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const villageTree = ref<any[]>([])

const { register, tableObject } = useTable()

tableObject.params = {
  projectId
}

const commonTableItemSchema = {
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
const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
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
    field: 'doorNo',
    label: '企业编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业编号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '企业名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称'
      }
    },
    table: {
      show: false
    }
  },

  // table 字段定义
  {
    field: 'serNoStr',
    label: '序号',
    ...commonTableItemSchema
  },
  {
    field: 'name',
    label: '行政村',
    ...commonTableItemSchema
  },
  {
    field: 'code',
    label: '代码',
    ...commonTableItemSchema
  },
  {
    field: 'gsInvest',
    label: '概算投资(元)',
    ...commonTableItemSchema
  },
  {
    field: 'guInvest',
    label: '调估投资(元)',
    ...commonTableItemSchema
  },
  {
    field: 'gaiInvest',
    label: '调概投资(元)',
    ...commonTableItemSchema
  },
  {
    label: '使用资金',
    children: [
      {
        field: 'amount',
        label: '金额(元)',
        ...commonTableItemSchema
      },
      {
        field: 'apr',
        label: '实际/概算(%)',
        ...commonTableItemSchema
      }
    ],
    ...commonTableItemSchema
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 150,
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
const onExport = () => {
  // const params = {
  //   exportType: '1',
  //   ...tableObject.params
  // }
  // const res = await exportReportApi(params)
  // let filename = res.headers
  // filename = filename['content-disposition']
  // filename = filename.split(';')[1].split('filename=')[1]
  // filename = decodeURIComponent(filename)
  // let elink = document.createElement('a')
  // document.body.appendChild(elink)
  // elink.style.display = 'none'
  // elink.download = filename
  // let blob = new Blob([res.data])
  // const URL = window.URL || window.webkitURL
  // elink.href = URL.createObjectURL(blob)
  // elink.click()
  // document.body.removeChild(elink)
  // URL.revokeObjectURL(elink.href)
}

// 关闭弹窗
const onFormPupClose = () => {
  dialog.value = false
}

// 点击事件
const handleClickItem = (row: any) => {
  console.log('row', row)
  dialog.value = true
}

const getTableList = async (params?: any) => {
  tableObject.loading = true
  const res = await getFundDetailReportListApi({
    projectId: projectId,
    ...params
  }).finally(() => {
    tableObject.loading = false
  })
  if (res) {
    // 赋值表格数据
    tableObject.tableList = res || []
  }
}

// 搜索
const setSearchParams = (data: any) => {
  getTableList(data)
}

getTableList()

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

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
  padding: 15px 0 0 15px;
  font-size: 14px;
  color: 14px;
}

:deep(.el-table .el-table__cell) {
  padding: 5px 0;
}
</style>
