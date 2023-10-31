<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">基础设置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">问题列表</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 问题列表 </div>
        <div></div>
      </div>

      <!-- <el-tabs v-model="tabId" class="demo-tabs" @tab-change="onTableClick">
        <el-tab-pane label="待解决" name="0" />
        <el-tab-pane label="已解决" name="1" />
        <el-tab-pane label="全部" name="-1" />
      </el-tabs> -->

      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        :showOverflowTooltip="true"
        :default-sort="{ prop: 'createdDate', order: 'descending' }"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #type="{ row }">
          <div>{{ getStateLabel(row.type) }}</div>
        </template>
        <template #status="{ row }">
          <div>{{ row.status === '0' ? '未处理' : row.status === '1' ? '已解决' : '未解决' }}</div>
        </template>
        <template #createdDate="{ row }">
          <div>{{ dayjs(row.createdDate).format('YYYY-MM-DD') }}</div>
        </template>
        <template #action="{ row }">
          <TableEditColumn
            :row="row"
            :view-type="'link'"
            :delete="false"
            :edit="false"
            :icons="[
              {
                icon: '',
                tooltip: '查看',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
          />
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/modules/app'
import {
  ElBreadcrumb,
  ElBreadcrumbItem
  // ElTabs,
  // ElTabPane
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getFeedBackListApi } from '@/api/workshop/feedback/service'
import { FeedbackStage, getStateLabel } from './config'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
// 处理结果 0未处理 1已完成 2未完成
// const tabId = ref<'-1' | '0' | '1' | '2'>('-1')

const { register, tableObject, methods } = useTable({
  getListApi: getFeedBackListApi
})

// const { register, tableObject, methods } = useTable({
//   getListApi: (params: any) => getFeedBackListApi(params, 'createdDate')
// })
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
  // status: tabId.value === '-1' ? '' : tabId.value
}

getList()

// 1资格认定 2资产评估 3安置确认 4择址确认 5腾空过度 6动迁协议 7搬迁安置 8生产安置

const schema = reactive<CrudSchema[]>([
  // 搜索栏
  {
    field: 'type',
    label: '反馈阶段',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: FeedbackStage
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householder',
    label: '户主/企业名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '可输入户主/企业名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'createdDate',
    label: '反馈时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: '请选择开始时间',
        endPlaceholder: '请选择结束时间'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'status',
    label: '解决状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '未处理',
            value: '0'
          },
          {
            label: '已解决',
            value: '1'
          },
          {
            label: '未解决',
            value: '2'
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  // 表格项
  {
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'householder',
    label: '户主/企业名称',
    search: {
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
    field: 'type',
    label: '工作阶段',
    search: {
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
    field: 'remark',
    label: '反馈内容',
    search: {
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
    field: 'createdDate',
    label: '反馈时间',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    sortable: {
      show: true
    }
  },
  {
    field: 'status',
    label: '解决状态',
    search: {
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
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: '100px',
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

const onViewRow = (row: any) => {
  console.log(row, 'row')
  push(`/Feedback/FeedbackDetail?id=${row.id}`)
}

// const onTableClick = (tab: any) => {
//   console.log(tab, 'tab')
//   tabId.value = tab
//   tableObject.params.status = tab === '-1' ? '' : tab
//   getList()
// }

const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData)

  // 处理参数
  let params = {
    projectId,
    ...searchData
  }

  setSearchParams({ ...params })
}
// onMounted(() => {
//   // 页面加载时手动触发排序操作
//   handleSortChange({
//     prop: 'createdDate',
//     order: 'descending'
//   })
// })
</script>
