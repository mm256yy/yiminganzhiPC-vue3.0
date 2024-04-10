<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度统计表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">专业项目</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度明细</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>
    <div class="line"></div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 专业项目进度明细报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
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
        height="600"
        show-overflow-tooltip
        @register="register"
      >
        <template #agreementStatus="{ row }">
          <div v-if="row?.agreementStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.agreementStatus == '0'"></div>
        </template>
        <template #startStatus="{ row }">
          <div v-if="row?.startStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.startStatus == '0'"></div>
        </template>
        <template #completeStatus="{ row }">
          <div v-if="row?.completeStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.completeStatus == '0'"></div>
        </template>
        <template #checkStatus="{ row }">
          <div v-if="row?.checkStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div v-if="row.checkStatus == '0'"></div>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getComprehensiveReportApi, exportReportApi } from '@/api/workshop/comprehensive/service'
import { screeningTree } from '@/api/workshop/village/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const { register, tableObject, methods } = useTable({
  getListApi: getComprehensiveReportApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId
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
    label: '专项编码',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入专项编码'
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
    field: 'villageCodeText',
    label: '所属区域',
    search: {
      show: false
    }
  },
  {
    field: 'baseInfo',
    label: '基本信息',
    search: {
      show: false
    },
    children: [
      {
        field: 'name',
        label: '项目名称',
        search: {
          show: false
        }
      },
      {
        field: 'code',
        label: '专项编码',
        search: {
          show: false
        }
      },
      {
        field: 'typeText',
        label: '专项类别',
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
        }
      },
      {
        field: 'agreementStatus',
        label: '协议签订',
        search: {
          show: false
        }
      }
    ]
  },
  {
    field: 'schedule',
    label: '进度',
    search: {
      show: false
    },
    children: [
      {
        field: 'startStatus',
        label: '开工',
        search: {
          show: false
        }
      },
      {
        field: 'completeStatus',
        label: '完工',
        search: {
          show: false
        }
      },
      {
        field: 'checkStatus',
        label: '验收',
        search: {
          show: false
        }
      }
    ]
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
  tableObject.params = {}
  setSearchParams({})
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params
  }
  const res = await exportReportApi(params)
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

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

const onBack = () => {
  back()
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
</style>
