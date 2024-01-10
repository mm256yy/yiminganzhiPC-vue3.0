<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">文物古迹报表</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div v-if="false" class="search-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 文物古迹报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%; max-height: 600px"
        height="600"
      >
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="project" label="项目名称" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="seatingPosition"
          label="坐落位置"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="clazz" label="等级" show-overflow-tooltip align="center" />
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
    const result = await getCommonReportApi(7)
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

  getList()
}

const onReset = () => {
  getList()
}

// 数据导出
const onExport = async () => {
  const res = await exportPhysicalApi(7)
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
