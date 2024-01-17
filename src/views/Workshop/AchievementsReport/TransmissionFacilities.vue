<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">专业项目</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">输变电工程设施</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 输变电工程设施公示表 </div>
        <ElButton type="primary" style="margin-bottom: 10px" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable :data="tableData" v-loading="tableLoading" style="width: 100%" height="600">
        <ElTableColumn type="index" width="80" label="序号" align="center" />
        <ElTableColumn prop="lineName" label="线路名称" show-overflow-tooltip align="center" />
        <ElTableColumn prop="ownershipCompany" label="权属" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="voltageClasses"
          label="电压等级（kV）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="wireType"
          label="导线类型、规格"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="wireCrossSection"
          label="导线截面（mm²）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="submergeEnthesis"
          label="淹没以及征（占）起止点"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="submergeWidth"
          label="淹没以及征（占）长度（km）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="concreteRoad"
          label="混凝土杆数（根）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="ironTower" label="铁塔数（基）" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="transformer"
          label="变压器（台）"
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
import { getCommonReportApi, exportPhysicalApi } from '@/api/workshop/achievementsReport/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()
const tableData = ref<any>([])
const tableLoading = ref<boolean>(false)

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const getList = async () => {
  tableLoading.value = true
  try {
    const result = await getCommonReportApi(6)
    tableData.value = result
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
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

const onExport = async () => {
  const res = await exportPhysicalApi(6)
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
</script>

<style scoped></style>
