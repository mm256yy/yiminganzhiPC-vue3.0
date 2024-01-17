<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">企(事)业单位</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">工作组统计</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @reset="setSearchParams"
      />
    </div>

    <div class="line"></div>

    <div class="table-wrap" v-loading="tableObject.loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 企业工作组统计表 </div>
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
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { enterpriseWorkGroupApi } from '@/api/workshop/enterpriseReport/service'
import { IndividualWorkType } from '@/api/workshop/individualWork/types'

import { screeningTree } from '@/api/workshop/village/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

interface SpanMethodProps {
  row: IndividualWorkType
  column: IndividualWorkType
  rowIndex: number
  columnIndex: number
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const { register, tableObject, methods } = useTable({
  getListApi: enterpriseWorkGroupApi
})
const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId
}

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
            field: 'populationStatusCount',
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

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

/**
 * 合并单元行
 * @param{Object} row 当前行
 * @param{Object} column 当前列
 * @param{Object} rowIndex 当前行下标
 * @param{Object} columnInex 当前列下标
 */
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  const num = tableObject.tableList.filter(
    (item: any) => item.gridmanName === row.gridmanName && item.totalHouse === row.totalHouse
  ).length
  const index = tableObject.tableList.findIndex(
    (item: any) => item.gridmanName === row.gridmanName && item.totalHouse === row.totalHouse
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

  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  if (!params.householdName) {
    delete params.householdName
  }
  if (!params.doorNo) {
    delete params.doorNo
  }
  if (params.villageCode) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.villageCode, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.villageCode
      }
      setSearchParams({ ...params })
    })
  } else {
    delete params.villageCode
    setSearchParams({ ...params })
  }
}

// 数据导出
const onExport = () => {
  // emit('export', villageTree.value, exportTypes.house)
  // const params = {
  //   exportType: '2',
  //   projectId,
  //   villageCode: code.value
  // }
  // const res = await exportReportApi(params)
  // let filename = res.headers
  // filename = filename['content-disposition']
  // filename = filename.split(';')[1].split('filename=')[1]
  // filename = decodeURIComponent(filename)
  // let elink = document.createElement('a')
  // document.body.appendChild(elink)
  // elink.style.display = 'none'
  // elink.download = filename
  // let blob = new Blob([res.data])
  // const URL = window.URL || window.webkitURL
  // elink.href = URL.createObjectURL(blob)
  // elink.click()
  // document.body.removeChild(elink)
  // URL.revokeObjectURL(elink.href)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

// 递归查找
const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}
const onBack = () => {
  back()
}

onMounted(() => {
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
