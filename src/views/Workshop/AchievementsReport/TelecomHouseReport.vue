<template>
  <WorkContentWrap>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 房屋及其附属物设备汇总表 </div>
        <ElButton type="primary" style="margin-bottom: 10px" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%; max-height: 600px"
        height="600"
      >
        <ElTableColumn prop="seq" label="序号" width="100" align="center" />
        <ElTableColumn prop="projectName" label="项目名称" show-overflow-tooltip align="center" />
        <ElTableColumn prop="unit" label="单位" show-overflow-tooltip align="center" />
        <ElTableColumn prop="quantity" label="数量" show-overflow-tooltip align="center" />
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElButton } from 'element-plus'

import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ref, reactive } from 'vue'
import { getCommonReportApi, exportPhysicalApi } from '@/api/workshop/achievementsReport/service'

const tableData = ref<any>([])
const tableLoading = ref<boolean>(false)
const getList = async () => {
  tableLoading.value = true
  try {
    const result = await getCommonReportApi(8)
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

const onExport = async () => {
  const res = await exportPhysicalApi(8)
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
