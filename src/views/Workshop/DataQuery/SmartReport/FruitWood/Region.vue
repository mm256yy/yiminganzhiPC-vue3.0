<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
      <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
    </div>
    <div class="line"></div>
    <div class="title-hint">零星林(果)木统计表（区域报表）</div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        border
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getAccessoryListApi } from '@/api/workshop/dataQuery/accessory-service'
import { screeningTree } from '@/api/workshop/village/service'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { register, tableObject, methods } = useTable({
  getListApi: getAccessoryListApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId,
  status: SurveyStatusEnum.Implementation
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCode',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: villageTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: false,
        checkStrictly: false,
        checkOnClickNode: false
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
    width: 80,
    search: {
      show: false
    }
  },
  {
    field: 'regionName',
    label: '区域名',
    search: {
      show: false
    }
  },
  {
    field: 'code',
    label: '区域编码',
    search: {
      show: false
    }
  },
  {
    field: 'cateGory',
    label: '品种',
    search: {
      show: false
    }
  },
  {
    field: 'sizeText',
    label: '规格',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'unit',
    label: '单位',
    search: {
      show: false
    }
  },
  {
    field: 'number',
    label: '数量',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

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

  setSearchParams({ ...params })
}

const onReset = () => {
  tableObject.params = {
    projectId
  }
  setSearchParams({})
}
// 数据导出
const onExport = () => {
  //     const params = {
  //     exportType: '1',
  //     ...tableObject.params
  //   }
  //   const res = await exportReportApi(params)
  //   let filename = res.headers
  //   filename = filename['content-disposition']
  //   filename = filename.split(';')[1].split('filename=')[1]
  //   filename = decodeURIComponent(filename)
  //   let elink = document.createElement('a')
  //   document.body.appendChild(elink)
  //   elink.style.display = 'none'
  //   elink.download = filename
  //   let blob = new Blob([res.data])
  //   const URL = window.URL || window.webkitURL
  //   elink.href = URL.createObjectURL(blob)
  //   elink.click()
  //   document.body.removeChild(elink)
  //   URL.revokeObjectURL(elink.href)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

onMounted(() => {
  getVillageTree()
  setSearchParams({})
})
</script>
<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  justify-content: space-between;
}

.table-wrap {
  margin-top: 0;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}

.title-hint {
  padding: 15px 0 0 15px;
  color: 14px;
  font-size: 14px;
}
</style>
