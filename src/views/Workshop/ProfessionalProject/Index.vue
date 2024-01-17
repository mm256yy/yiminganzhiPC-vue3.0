<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">移民实施</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">专业项目</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">专业项目列表</span>
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            总共 <span class="num">{{ tableObject.tableList.length }}</span> 个
          </div>
        </div>
        <div class="table-header-right">
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
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
        <template #filling="{ row }">
          <div class="filling-btn" @click="fillData(row)">数据填报</div>
        </template>
        <template #action="{ row }">
          <ElButton type="primary" link @click="onEditRow(row)">编辑</ElButton>
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      @close="onFormPupClose"
      :districtTree="districtTree"
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
import EditForm from './components/EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getProfessionalProjectListApi } from '@/api/professional/service'
import { useRouter } from 'vue-router'
import type { ProfessionalProjectDtoType } from '@/api/professional/types'
import { useIcon } from '@/hooks/web/useIcon'
import { getDistrictTreeApi } from '@/api/district'

const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const actionType = ref<'add' | 'edit' | 'view'>('add')
const districtTree = ref()
const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识

const { register, tableObject, methods } = useTable({
  getListApi: getProfessionalProjectListApi
})

const { setSearchParams } = methods

// 需要重置一次params
tableObject.params = {
  projectId
}

setSearchParams({ name: '', code: '' })

const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '专项名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入专项名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'code',
    label: '专项编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入编号'
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
    label: '专项名称',
    search: {
      show: false
    }
  },
  {
    field: 'code',
    label: '专项编码',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'projectSchedule',
    label: '项目进度',
    search: {
      show: false
    }
  },
  {
    field: 'typeText',
    label: '专项类别',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'underlyingCompany',
    label: '权属单位名称',
    width: 100,
    table: {
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

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = async (row: ProfessionalProjectDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = { ...row }
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    setSearchParams({ name: '', code: '' })
  }
}
const getDistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const onSearch = (data) => {
  setSearchParams({ ...data })
}
onMounted(() => {
  getDistrictTree()
})
// 数据填报
const fillData = (row: any) => {
  push({
    name: 'ProfessionalDataFill',
    query: {
      professionalId: row.id,
      projectId: row.projectId
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
