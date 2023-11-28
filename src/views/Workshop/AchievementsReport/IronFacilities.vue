<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">铁塔工程设施汇总表</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 铁塔工程设施汇总表 </div>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="projectName" label="基站名称" show-overflow-tooltip align="center" />
        <ElTableColumn label="机房" align="center">
          <ElTableColumn prop="number" label="数量（座）" show-overflow-tooltip align="center" />
        </ElTableColumn>
        <ElTableColumn prop="area" label="房屋面积（㎡）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="structure" label="房屋结构" show-overflow-tooltip align="center" />
      </ElTable>
      <ElTableColumn prop="useUnit" label="基站使用单位" show-overflow-tooltip align="center" />
      <ElTableColumn prop="equipment" label="设施设备" show-overflow-tooltip align="center" />
      <!-- <img src="@/assets/imgs/report/iron_facilities.png" alt="" /> -->
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'

import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ref, reactive } from 'vue'

import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()
const tableData = ref<any>([])

const BackIcon = useIcon({ icon: 'iconoir:undo' })

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
