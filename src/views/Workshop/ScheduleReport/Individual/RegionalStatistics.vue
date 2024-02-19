<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度统计表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">区域统计</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="line"></div>
    <div class="table-wrap" v-loading="tableObject.loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 个体户区域统计表 </div>
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
        :span-method="objectSpanMethod"
        row-key="id"
        headerAlign="center"
        align="center"
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { individualRegionApi } from '@/api/workshop/individualRegion/service'
import { IndividualRegionType } from '@/api/workshop/individualRegion/type'
import { exportRegionalStatisticsApi } from '@/api/workshop/scheduleReport/service'
import { screeningTree } from '@/api/workshop/village/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

interface SpanMethodProps {
  row: IndividualRegionType
  column: IndividualRegionType
  rowIndex: number
  columnIndex: number
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const { register, tableObject, methods } = useTable({
  getListApi: individualRegionApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

const schema = reactive<CrudSchema[]>([
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
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'totalHouse',
    label: '总个数（家）',
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

/**
 * 合并单元行
 * @param{Object} row 当前行
 * @param{Object} column 当前列
 * @param{Object} rowIndex 当前行下标
 * @param{Object} columnInex 当前列下标
 */
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  const num = tableObject.tableList.filter(
    (item: any) => item.householdName === row.householdName && item.doorNo === row.doorNo
  ).length
  const index = tableObject.tableList.findIndex(
    (item: any) => item.householdName === row.householdName && item.doorNo === row.doorNo
  )
  if (column && columnIndex < 5) {
    if (index === rowIndex) {
      return {
        rowspan: num,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 数据导出
const onExport = async () => {
  const params = {
    type: 'IndividualHousehold'
  }
  const res = await exportRegionalStatisticsApi(params)
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
