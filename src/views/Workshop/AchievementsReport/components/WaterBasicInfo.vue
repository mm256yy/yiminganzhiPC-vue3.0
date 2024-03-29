<template>
  <WorkContentWrap>
    <!-- 水电站基本情况 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 水电站基本情况汇总表 </div>
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
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip align="center" width="180" />
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
        <ElTableColumn prop="fixedAssets" label="固定资产" align="center">
          <ElTableColumn prop="originalValue" label="原值（万元）" align="center" />
          <ElTableColumn prop="netWorth" label="净值（万元）" align="center" />
        </ElTableColumn>
        <ElTableColumn prop="employees" label="职工人数" align="center">
          <ElTableColumn prop="regularWorker" label="正式工（人）" align="center" />
          <ElTableColumn prop="temporaryPerson" label="临时工（万元）" align="center" />
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import { getCommonReportApi, exportPhysicalApi } from '@/api/workshop/achievementsReport/service'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'

const tableData = ref<any>([])
const tableLoading = ref<boolean>(false)
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { tableObject } = useTable()

const getList = async () => {
  // const params={
  //   ...tableObject.params
  // }
  tableLoading.value = true
  try {
    const result = await getCommonReportApi(1)
    tableData.value = result
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'PeasantHousehold')
  villageTree.value = list || []
  return list || []
}

const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'code',
    label: '区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: districtTree,
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
    field: 'name',
    label: '水电站名称',
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

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code == code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
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

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  params[getParamsKey('Country')] = null
  params[getParamsKey('Township')] = null
  params[getParamsKey('Village')] = null
  params[getParamsKey('NaturalVillage')] = null
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      tableObject.params = {
        ...params
      }
      getList()
    })
  } else {
    tableObject.params = {
      ...params
    }
    getList()
  }
}

const onReset = () => {
  // 需要重置一次params
  tableObject.params = {
    projectId
  }

  getList()
}

onMounted(() => {
  getVillageTree()
  getdistrictTree()
  getList()
})
</script>

<style lang="less" scoped>
.container {
  // width: 100%;
  overflow-x: auto;
  background-color: #f00;
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
