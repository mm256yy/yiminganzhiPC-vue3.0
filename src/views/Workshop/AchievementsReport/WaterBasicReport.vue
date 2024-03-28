<template>
  <WorkContentWrap>
    <!-- 水电站 -->
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">企(事)业单位</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">水电站</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 水电站报表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <ElTable
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%; max-height: 600px"
        height="600"
      >
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="location" label="所在地点" show-overflow-tooltip align="center" />
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip align="center" />
        <ElTableColumn prop="legalPerson" label="法人代表" show-overflow-tooltip align="center" />
        <ElTableColumn prop="ownership" label="权属性质" show-overflow-tooltip align="center" />
        <ElTableColumn prop="ownershipUnit" label="权属单位" show-overflow-tooltip align="center" />
        <ElTableColumn prop="landUse" label="用地性质" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="completionDate"
          label="建成年月"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="scale" label="规模" show-overflow-tooltip align="center" />
        <ElTableColumn prop="volume" label="库容（万m³）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="drinkingWater" label="引水来源" show-overflow-tooltip align="center" />
        <ElTableColumn prop="lift" label="杨程（m）" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="channel"
          label="渠（管）道（m）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="yearGeneratedEnergy"
          label="年发电量（万KW.h）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="volume_t" label="库容（万m³）" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="mainStructure"
          label="主要建筑物"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="businessCertificate"
          label="工商证"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="registeredCapital"
          label="注册资金（万元）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="yearProductionValue"
          label="年产总值（万元）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="annualProfit"
          label="年利润（万元）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="grossAnnualWages"
          label="年工资总额（万元）"
          show-overflow-tooltip
          align="center"
        />
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
    const result = await getCommonReportApi(1)
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
  const res = await exportPhysicalApi(1)
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

<style lang="less" scoped>
.container {
  width: 100%;
  overflow-x: auto;
}
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
/*定义滑块
     内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #ece6e6;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
