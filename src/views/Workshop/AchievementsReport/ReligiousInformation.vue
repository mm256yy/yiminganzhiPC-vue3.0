<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">宗教基本信息</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 宗教基本信息报表 </div>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="name" label="项目名称" show-overflow-tooltip align="center" />
        <ElTableColumn prop="religion" label="宗教" show-overflow-tooltip align="center" />
        <ElTableColumn prop="localVillage" label="所在村" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="detailedAddress"
          label="详细地址"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="principal" label="负责人" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="registerNumber"
          label="登记证号"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="competentDepartment"
          label="主管部门"
          show-overflow-tooltip
          align="center"
        />
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'

import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ref, reactive } from 'vue'
import { getCommonReportApi } from '@/api/workshop/achievementsReport/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const tableData = ref<any>([])
const { back } = useRouter()

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const getList = async () => {
  const result = await getCommonReportApi(18)
  tableData.value = result
}

getList()

const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'qy',
    label: '区域',
    search: {
      show: true,
      component: 'Select'
    },
    table: {
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
    field: 'doorNo',
    label: '户号',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
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
    field: 'name',
    label: '姓名',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
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
const onBack = () => {
  back()
}
</script>

<style scoped></style>
