<!--居民户资金发放明细-->
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
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableLoading"
        :data="tableObject.tableList"
        :columns="schemas.columns"
        :showOverflowTooltip="true"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        max-height="600"
      >
        <template #action="{ row }">
          <ElButton size="small" type="primary" link @click="handleClickItem(row)">
            查看详情
          </ElButton>
        </template>
      </Table>
    </div>
    <HouseholdEdit
      :show="dialog"
      @close="onFormPupClose"
      :doorNo="currentDoorNo"
      :projectId="projectId"
      :village="route.query.id"
    />
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
import { getHouseholdReportListApi, exportFundHouseholdApi } from '@/api/fundReport/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
import HouseholdEdit from './components/HouseholdEdit.vue'
import { screeningTree } from '@/api/workshop/village/service'
import { useTable } from '@/hooks/web/useTable'
import { useRoute } from 'vue-router'
let titles = ref(['智能报表', '资金管理', '居民户', '资金使用情况'])
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const villageTree = ref<any[]>([])
const currentDoorNo = ref<string>('') // 当前户号

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

const { tableObject } = useTable()
const tableLoading = ref<boolean>()
let schemas = reactive<any>({
  columns: []
})
let route = useRoute()

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
    label: route.query.id == 'true' ? '村集体编号' : '户号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: route.query.id == 'true' ? '请输入村集体编号' : '请输入户号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: route.query.id == 'true' ? '村集体名称' : '户主姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: route.query.id == 'true' ? '请输入村集体名称' : '请输入户主姓名'
      }
    },
    table: {
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
  tableObject.params = params
  getTableList()
}

const onReset = () => {
  tableObject.params = {}
  getTableList()
}

const getTableDepends = (list: any) => {
  let columns: any = [
    {
      field: 'index',
      label: '序号',
      type: 'index',
      width: 80
    },
    {
      field: '0',
      label: '行政村',
      width: 120,
      ...commonTableItemSchema
    },
    {
      field: '2',
      label: route.query.id == 'true' ? '村集体编号' : '户号',
      ...commonTableItemSchema
    },
    {
      field: '3',
      label: route.query.id == 'true' ? '村集体名称' : '户主姓名',
      ...commonTableItemSchema
    },
    {
      field: '4',
      label: '补偿费',
      children: [
        {
          field: '4',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '5',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '5',
      label: '补助费',
      children: [
        {
          field: '6',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '7',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
    },
    {
      field: '6',
      label: '奖励费',
      children: [
        {
          field: '8',
          label: '应发',
          ...commonTableItemSchema
        },
        {
          field: '9',
          label: '已发',
          ...commonTableItemSchema
        }
      ]
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
  ]
  // if (route.query.id != 'true') {
  //   columns.splice(7, 0, {
  //     field: '6',
  //     label: '其他',
  //     children: [
  //       {
  //         field: '9',
  //         label: '应发',
  //         ...commonTableItemSchema
  //       },
  //       {
  //         field: '10',
  //         label: '已发',
  //         ...commonTableItemSchema
  //       }
  //     ]
  //   })
  // }
  let allData = useCrudSchemas(columns)
  schemas.columns = allData.allSchemas.tableColumns
  tableObject.tableList = list
}

// 数据导出
const onExport = async () => {
  const params = getSearchParams()
  const res = await exportFundHouseholdApi(params)
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

// 关闭弹窗
const onFormPupClose = () => {
  dialog.value = false
}

// 点击事件
const handleClickItem = (row: any) => {
  console.log('row', row[1])
  currentDoorNo.value = row[1]
  dialog.value = true
}

const getSearchParams = () => {
  return {
    ...tableObject.params,
    size: tableObject.size,
    page: tableObject.currentPage,
    phType: route.query.id == 'true' ? 'Village' : null
  }
}

const getTableList = async () => {
  tableLoading.value = true
  const params = getSearchParams()
  const res = await getHouseholdReportListApi(params).finally(() => {
    tableLoading.value = false
  })
  if (res) {
    // 赋值表格数据
    res.list.content.forEach((item) => {
      return item.shift()
    })
    tableObject.total = res.list.total
    getTableDepends(res.list.content)
  }
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

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
onMounted(() => {
  getVillageTree()
  console.log(route.query.id, 111)
  if (route.query.id == 'true') {
    titles.value = ['智能报表', '资金管理', '村集体', '资金使用情况']
  }
  getTableList()
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
