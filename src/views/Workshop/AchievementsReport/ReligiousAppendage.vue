<template>
  <WorkContentWrap>
    <div v-if="false" class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">宗教设施房屋及其附属建筑物</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 宗教房屋及其附属建筑物报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%; max-height: 600px"
        height="600"
      >
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip align="center" />
        <ElTableColumn label="房屋建筑面积（㎡）" header-align="center">
          <ElTableColumn prop="brickStructure" label="砖混" show-overflow-tooltip align="center" />
          <ElTableColumn prop="brickJoisted" label="砖木" show-overflow-tooltip align="center" />
          <ElTableColumn prop="simple" label="简易" show-overflow-tooltip align="center" />
        </ElTableColumn>
        <ElTableColumn label="光缆" header-align="center">
          <ElTableColumn
            prop="cableTelevision"
            label="有限电视（处）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn
            prop="networkBroadband"
            label="网络宽带（处）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="phone" label="电话（处）" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="airConditioner"
            label="空调（处）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn
            prop="powerMeter"
            label="动力电表（只）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn
            prop="solarWaterHeater"
            label="太阳能热水器（只）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="step" label="台阶（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="flowerBed" label="花坛（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="well" label="水井（口）" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="impoundingReservoir"
            label="蓄水池（口）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="wall" label="围墙（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="gate" label="台门（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="makeshiftBridge"
            label="便桥（㎡）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="firewood" label="柴灶（座）" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="waterTower"
            label="水塔（个）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="shed" label="棚（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="terrace" label="地坪（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="laundryTable"
            label="洗衣台（㎡）"
            show-overflow-tooltip
            align="center"
          />
        </ElTableColumn>

        <ElTableColumn label="零星林（果）木" header-align="center">
          <ElTableColumn prop="fruitTree" label="果树" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="commercialTreeSpecies"
            label="用材树"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="landscapeTree" label="景观树" show-overflow-tooltip align="center" />
        </ElTableColumn>
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
    const result = await getCommonReportApi(19)
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

const onExport = async () => {
  const res = await exportPhysicalApi(19)
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
