<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度统计表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">工作组统计</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-wrap">
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
        <div class="table-left-title"> 个体户工作组统计表 </div>
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
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { individualWorkGroupApi } from '@/api/workshop/individualRegion/service'
import { exportWorkGroupApi } from '@/api/workshop/scheduleReport/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const { register, tableObject, methods } = useTable({
  getListApi: individualWorkGroupApi
})
const { getList } = methods

getList()

const schema = reactive<CrudSchema[]>([
  {
    field: 'gridmanName',
    label: '工作组',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入工作组名称'
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
    field: 'gridmanName',
    label: '工作组',
    search: {
      show: false
    }
  },
  {
    field: 'totalHouse',
    label: '总任务数（户）',
    search: {
      show: false
    }
  },
  {
    field: 'relocation',
    label: '动迁阶段',
    search: {
      show: false
    },
    children: [
      {
        field: 'assess',
        label: '资产评估',
        search: {
          show: false
        },
        children: [
          {
            field: 'appendageStatusCount',
            label: '房屋/附属物',
            search: {
              show: false
            }
          },
          {
            field: 'landStatusCount',
            label: '土地/附着物',
            search: {
              show: false
            }
          },
          {
            field: 'deviceStatusCount',
            label: '设施设备',
            search: {
              show: false
            }
          }
        ]
      },
      {
        field: 'cardStatusCount',
        label: '个体户建卡',
        search: {
          show: false
        }
      },
      {
        field: 'soar',
        label: '腾空',
        search: {
          show: false
        },
        children: [
          {
            field: 'houseSoarStatusCount',
            label: '房屋腾空',
            search: {
              show: false
            }
          },
          {
            field: 'landSoarStatusCount',
            label: '土地腾空',
            search: {
              show: false
            }
          }
        ]
      },
      {
        field: 'agreementStatusCount',
        label: '动迁协议',
        search: {
          show: false
        }
      }
    ]
  },
  {
    field: 'placement',
    label: '安置阶段',
    search: {
      show: false
    },
    children: [
      {
        field: 'proceduresStatusCount',
        label: '相关手续',
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

  tableObject.params = params
  getList()
}

const onReset = () => {
  tableObject.params = {}
  getList()
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params,
    type: 'IndividualHousehold'
  }
  const res = await exportWorkGroupApi(params)
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

const onBack = () => {
  back()
}
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
