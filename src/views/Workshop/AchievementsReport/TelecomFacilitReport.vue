<template>
  <WorkContentWrap>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 电信工程设施汇总表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%; max-height: 600px"
        height="600"
      >
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="projectName" label="项目" show-overflow-tooltip align="center" />
        <ElTableColumn label="杆路" header-align="center">
          <ElTableColumn
            prop="poleSpecification"
            label="规格"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="poleWidth" label="长度(km)" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="poleQuantity"
            label="根数(个)"
            show-overflow-tooltip
            align="center"
          />
        </ElTableColumn>
        <ElTableColumn label="光缆" header-align="center">
          <ElTableColumn
            prop="opticalCableSpecification"
            label="规格"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn
            prop="opticalCableWidth"
            label="长度(km)"
            show-overflow-tooltip
            align="center"
          />
        </ElTableColumn>
        <ElTableColumn prop="baseStation" label="基站（座）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="machineRoom" label="机房（座）" show-overflow-tooltip align="center" />
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
    const result = await getCommonReportApi(9)
    tableData.value = result
    tableLoading.value = false
  } catch {
    tableLoading.value = false
    tableData.value = []
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
  const res = await exportPhysicalApi(9)
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
