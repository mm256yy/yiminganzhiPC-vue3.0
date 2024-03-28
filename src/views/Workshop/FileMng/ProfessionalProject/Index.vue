<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">档案管理</ElBreadcrumbItem>
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
            总共 <span class="num">{{ tableObject.total }}</span> 个
          </div>
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
        <template #action="{ row }">
          <ElButton type="primary" link @click="onCheckRow(row)">查看档案</ElButton>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getProfessionalProjectListApi } from '@/api/professional/service'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId

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
    label: '权属单位',
    width: 100,
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
    },
    showOverflowTooltip: false
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

const onSearch = (data) => {
  setSearchParams({ ...data })
}

// 查看档案
const onCheckRow = (row) => {
  push({
    name: 'FileMngCheck',
    query: {
      householdId: row.id,
      doorNo: row.code,
      type: '4'
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
