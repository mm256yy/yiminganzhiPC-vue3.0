<template>
  <!-- 搜素 -->
  <div class="search-form-wrap">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />
  </div>

  <div class="table-wrap">
    <div class="flex items-center justify-between pb-12px">
      <div class="table-header-left">
        <span style="margin: 0 10px; font-size: 16px; font-weight: 600">资金发放记录</span>
        <div class="text">
          预拨款总额：11000000.01元 &nbsp;&nbsp; 发放金额：100000.09元 &nbsp;&nbsp; 余额：9999.99元
        </div>
      </div>
      <ElSpace>
        <ElButton type="primary" @click="onBatchRelease"> 批量发放 </ElButton>
        <ElButton type="primary" @click="onBatchReleaseTemplate"> 批量发放模板 </ElButton>
      </ElSpace>
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
      <template #action="{ row }">
        <ElButton link type="primary" @click="onCheckRow(row)">查看</ElButton>
        <ElButton link type="primary" @click="onIssue(row)">发放</ElButton>
      </template>
    </Table>
    <!--发放-->
    <EditForm :show="editDialog" :type="props.type" :row="itemRow" @close="onEditFormClose" />
    <!--查看-->
    <CheckForm :show="checkDialog" :type="props.type" :row="itemRow" @close="onCheckFormClose" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElButton, ElSpace, ElMessage } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useAppStore } from '@/store/modules/app'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import EditForm from '../../components/EditForm.vue'
import CheckForm from '../../components/CheckForm.vue'
import { filterViewDoorNo } from '@/utils/index'
import type { TownshipFundEntryDtoType } from '@/api/fundManage/townshipFundEntry-types'
import { getFundDistributionListApi } from '@/api/fundManage/townshipFundEntry-service'

interface PropsType {
  type: number // 类型
}

const props = defineProps<PropsType>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const districtTree = ref<any[]>([])
const selectionIds = ref<any[]>([]) // 选择的项 id 集合
const itemRow = ref<any>({})

const editDialog = ref<boolean>(false)
const checkDialog = ref<boolean>(false)

const { register, tableObject, methods } = useTable({
  getListApi: getFundDistributionListApi
})

const { setSearchParams, getSelections } = methods

setSearchParams({ name: '', type: 'PeasantHousehold' })

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

// 批量发放
const onBatchRelease = async () => {
  const res = await getSelections()
  selectionIds.value = [...res]
  if (res && res.length) {
    // 执行批量发放操作
  } else {
    ElMessage.info('请先勾选列表数据')
  }
}
// 批量发放模板
const onBatchReleaseTemplate = () => {}

onMounted(() => {
  getdistrictTree()
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
    field: 'name',
    label: '户主',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '户主姓名'
      }
    },
    table: {
      show: false
    }
  },
  // table字段
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
    field: 'intoAccount',
    label: '到账（元）',
    search: {
      show: false
    }
  },
  {
    field: 'issuedAmount',
    label: '已发放（元）',
    search: {
      show: false
    }
  },
  {
    field: 'toIssued',
    label: '待发放',
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

// 发放
const onIssue = (row: TownshipFundEntryDtoType) => {
  itemRow.value = row
  editDialog.value = true
}
// 查看
const onCheckRow = (row: TownshipFundEntryDtoType) => {
  itemRow.value = row
  checkDialog.value = true
}

const onEditFormClose = () => {
  editDialog.value = false
}

const onCheckFormClose = () => {
  checkDialog.value = false
}
</script>
<style lang="less">
.el-divider--horizontal {
  margin: 8px 0 24px;
}
</style>
