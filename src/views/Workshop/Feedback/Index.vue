<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">基础设置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">问题列表</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 问题列表 </div>
        <div></div>
      </div>

      <el-tabs v-model="tabId" class="demo-tabs" @tab-click="onTableClick">
        <el-tab-pane label="全部" name="-1" />
        <el-tab-pane label="待解决" name="0" />
        <el-tab-pane label="未解决" name="1" />
      </el-tabs>

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
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #latitude="{ row }">
          <div>{{ row.longitude }}</div>
          <div>{{ row.latitude }}</div>
        </template>
        <template #createdDate="{ row }">
          <div>{{ row.createdDate }}</div>
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
import { reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElBreadcrumb, ElBreadcrumbItem, ElTabs, ElTabPane } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getVillageListApi, delVillageByIdApi } from '@/api/workshop/village/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const tabId = ref<'-1' | '0' | '1'>('-1')

const { register, tableObject, methods } = useTable({
  getListApi: getVillageListApi,
  delListApi: delVillageByIdApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const schema = reactive<CrudSchema[]>([
  // 搜索栏
  {
    field: 'stage',
    label: '反馈阶段',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '资格认定',
            value: 'a'
          },
          {
            label: '房屋腾空',
            value: 'b'
          },
          {
            label: '安置确认',
            value: 'c'
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
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
    field: 'time',
    label: '反馈时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
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
            label: '未解决',
            value: '0'
          },
          {
            label: '已解决',
            value: '1'
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
    field: 'id',
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
    field: ' status',
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
    field: 'content',
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
    field: 'town',
    label: '反馈时间',
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
    field: 'village',
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

// const onDelRow = async (row: any | null, multiple: boolean) => {
//   tableObject.currentRow = row
//   const { delList, getSelections } = methods
//   const selections = await getSelections()
//   await delList(
//     multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
//     multiple
//   )
// }

const onViewRow = (row: any) => {
  console.log(row, 'row')
}

const onTableClick = (tab: any) => {
  console.log(tab, 'tab')
}
</script>
