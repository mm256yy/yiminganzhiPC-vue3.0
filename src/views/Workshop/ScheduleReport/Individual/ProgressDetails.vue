<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度统计表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度明细</ElBreadcrumbItem>
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
        <div class="table-left-title"> 个体户进度明细表 </div>
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
      >
        <template #appendageStatus="{ row }">
          <div v-if="row.appendageStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
        </template>
        <template #landStatus="{ row }">
          <div v-if="row.landStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
        </template>
        <template #deviceStatus="{ row }">
          <div v-if="row.deviceStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
        </template>
        <template #cardStatus="{ row }">
          <div v-if="row.cardStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
        </template>
        <template #houseSoarStatus="{ row }">
          <div v-if="row.houseSoarStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
        </template>
        <template #landSoarStatus="{ row }">
          <div v-if="row.landSoarStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
        </template>
        <template #agreementStatus="{ row }">
          <div v-if="row.agreementStatus == '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
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
import { individualProgressRegionApi } from '@/api/workshop/individualRegion/service'
import { IndividualRegionType } from '@/api/workshop/individualRegion/type'
import { screeningTree } from '@/api/workshop/village/service'
import { exportTypes } from '../../DataQuery/DataCollectionPublicity/config'
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
  getListApi: individualProgressRegionApi
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
        showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'no',
    label: '个体户编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '个体户名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户主姓名'
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
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '个体户编号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '个体户名称',
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
            field: 'appendageStatus',
            label: '房屋/附属物',
            search: {
              show: false
            }
          },
          {
            field: 'landStatus',
            label: '土地/附着物',
            search: {
              show: false
            }
          },
          {
            field: 'deviceStatus',
            label: '设施设备',
            search: {
              show: false
            }
          }
        ]
      },
      {
        field: 'cardStatus',
        label: '个体户建卡',
        search: {
          show: false
        }
      },
      {
        field: 'vacate',
        label: '腾空',
        search: {
          show: false
        },
        children: [
          {
            field: 'inCohouseSoarStatusunt',
            label: '房屋腾空',
            search: {
              show: false
            }
          },
          {
            field: 'landSoarStatus',
            label: '土地腾空',
            search: {
              show: false
            }
          }
        ]
      },
      {
        field: 'agreementStatus',
        label: '动迁协议',
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  setSearchParams({ ...params })
}

const onReset = () => {
  setSearchParams({})
}

// 数据导出
const onExport = () => {
  emit('export', villageTree.value, exportTypes.house)
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
