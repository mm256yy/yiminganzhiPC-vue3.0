<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度统计表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">企(事)业单位</ElBreadcrumbItem>
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
        <div class="table-left-title"> 企业进度明细统计表 </div>
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
        :summary-method="getSummaries"
        show-summary
        show-overflow-tooltip
        align="center"
      >
        <template #appendageStatus="{ row }">
          <div v-if="row.appendageStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #graveStatus="{ row }">
          <div v-if="row.graveStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #deviceStatus="{ row }">
          <div v-if="row.deviceStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #cardStatus="{ row }">
          <div v-if="row.cardStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #houseSoarStatus="{ row }">
          <div v-if="row.houseSoarStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #landSoarStatus="{ row }">
          <div v-if="row.landSoarStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #agreementStatus="{ row }">
          <div v-if="row.agreementStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
        </template>
        <template #proceduresStatus="{ row }">
          <div v-if="row.proceduresStatus === '1'">
            <Icon icon="ep:check" color="#000000" />
          </div>
          <div e-else></div>
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
import { getEnterpriseReportApi } from '@/api/workshop/enterpriseReport/service'
import { screeningTree } from '@/api/workshop/village/service'
import { exportProgressDetailApi } from '@/api/workshop/scheduleReport/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'

const { back } = useRouter()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const totalCountObj = ref<any>() // 总计对象
const { tableObject } = useTable()
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
    field: 'doorNo',
    label: '企业编号',
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
    field: 'name',
    label: '企业名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称'
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
    label: '企业编号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '企业',
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
        field: 'estimate',
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
            field: 'graveStatus',
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
        label: '企业建卡',
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
            field: 'houseSoarStatus',
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
  },
  {
    field: 'placement',
    label: '安置阶段',
    search: {
      show: false
    },
    children: [
      {
        field: 'proceduresStatus',
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
  requestListApi()
}

const onReset = () => {
  tableObject.params = {}
  requestListApi()
}

const getSummaries = (params: any) => {
  const { columns } = params
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (index < 4) {
      sums[index] = ''
      return
    }
    console.log(column)
    if (!totalCountObj.value) {
      return
    }
    const totalMap = {
      4: totalCountObj.value.appendageStatusTotal, // 房屋、附属物
      5: totalCountObj.value.landSeedlingStatusTotal, // 土地附属物
      6: totalCountObj.value.deviceStatusTotal, // 设施设备
      7: totalCountObj.value.cardStatusTotal, // 企业建卡
      8: totalCountObj.value.houseSoarStatusTotal, // 房屋腾空
      9: totalCountObj.value.landSoarStatusTotal, // 土地腾空
      10: totalCountObj.value.agreementStatusTotal, // 动迁协议
      11: totalCountObj.value.proceduresStatusTotal // 相关手续
      // 12: totalCountObj.value.chooseHouseStatusTotal,
      // 13: totalCountObj.value.chooseGraveStatusTotal,
      // 14: totalCountObj.value.cardStatusTotal,
      // 15: totalCountObj.value.houseSoarStatusTotal,
      // 16: totalCountObj.value.landSoarStatusTotal,
      // 17: totalCountObj.value.excessStatusTotal,
      // 18: totalCountObj.value.agreementStatusTotal,
      // 19: totalCountObj.value.buildOneselfStatusTotal,
      // 20: totalCountObj.value.flatsStatusTotal,
      // 21: totalCountObj.value.centralizedSupportStatusTotal
    }
    sums[index] = totalMap[index]
    return
  })
  return sums
}

// 数据导出
const onExport = async () => {
  const params = {
    ...tableObject.params,
    type: 'Company'
  }
  const res = await exportProgressDetailApi(params)
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

const requestListApi = () => {
  tableObject.loading = true
  getEnterpriseReportApi(tableObject.params).then((res) => {
    tableObject.tableList = res.content
    totalCountObj.value = res.other
    tableObject.loading = false
  })
}

requestListApi()

onMounted(() => {
  getVillageTree()
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

.fill-field {
  width: calc(100% + 20px);
  height: 100%;
  padding: 12px 0;
  margin: 0 -20px;
  background-color: #67c23a;
  box-sizing: border-box;
}

// ::v-deep(.el-table .cell) {
//   margin: -8px 0;
// }
</style>
