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
        <div class="table-left-title"> 资金发放明细报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        showOverflowTooltip
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
    <CommonFeeEdit :show="dialog" @close="onFormPupClose" type="1" :doorNo="currentDoorNo" />
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
import { getCardReportApi, exportFundIndividualApi } from '@/api/fundReport/service'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'
import CommonFeeEdit from './components/CommonFeeEdit.vue'
import { screeningTree } from '@/api/workshop/village/service'

const titles = ['智能报表', '资金管理', '企业', '资金使用情况']
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const villageTree = ref<any[]>([])
const currentDoorNo = ref<string>('')

const { register, tableObject } = useTable()

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
    field: 'index',
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    field: 'villageCodeText',
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '企业编号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '企业名称',
    search: {
      show: false
    }
  },
  {
    field: '3',
    label: '补偿费',
    children: [
      {
        field: 'bcfSum',
        label: '应发'
      },
      {
        field: 'bcfSumPay',
        label: '已发'
      }
    ]
  },
  {
    field: '4',
    label: '补助费',
    children: [
      {
        field: 'bzfSum',
        label: '应发'
      },
      {
        field: 'bzfSumPay',
        label: '已发'
      }
    ]
  },
  {
    field: '5',
    label: '奖励费',
    children: [
      {
        field: 'jlfSum',
        label: '应发'
      },
      {
        field: 'jlfSumPay',
        label: '已发'
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
    type: '1',
    ...tableObject.params
  }
  const res = await exportFundIndividualApi(params)
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
  console.log('row', row)
  currentDoorNo.value = row.doorNo
  dialog.value = true
}

const getTableList = async () => {
  tableObject.loading = true
  const params = {
    ...tableObject.params,
    type: '1'
  }
  const res = await getCardReportApi(params).finally(() => {
    tableObject.loading = false
  })
  if (res) {
    // 赋值表格数据
    tableObject.tableList = res || []
  }
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
