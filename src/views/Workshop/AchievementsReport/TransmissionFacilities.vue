<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">专业项目(输变电工程设施) 公示表</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 专业项目(输变电工程设施) 公示表 </div>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn prop="lineName" label="线路名称" show-overflow-tooltip align="center" />
        <ElTableColumn prop="doorMaster" label="权属" show-overflow-tooltip align="center" />
        <ElTableColumn prop="region" label="电压等级（kV）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="region" label="导线类型、规格" show-overflow-tooltip align="center" />
        <ElTableColumn prop="region" label="导线截面（mm²）" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="region"
          label="淹没以及征（占）起止点"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="region"
          label="淹没以及征（占）长度（km）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="region"
          label="混凝土杆数（根）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="region" label="铁塔数（基）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="region" label="变压器（台）" show-overflow-tooltip align="center" />
      </ElTable>
      <!-- <img src="@/assets/imgs/report/Transmission_facilities.png" alt="" /> -->
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
