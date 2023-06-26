<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="resetSearch"
      />
    </div>

    <div class="line"></div>

    <div class="table-wrap" v-loading="loading">
      <div class="flex items-center justify-between pb-12px">
        <div></div>
        <ElSpace>
          <ElButton type="primary" @click="onExport">数据导出</ElButton>
        </ElSpace>
      </div>

      <el-table :data="tableDataList" border :height="getHeight(tableDataList)" style="width: 100%">
        <el-table-column
          prop="householdName"
          label="村集体名称"
          align="center"
          header-align="center"
        />
        <el-table-column prop="type" label="类型" align="center" header-align="center" />
        <el-table-column prop="plowland" label="耕地(亩)" align="center" header-align="center" />
        <el-table-column prop="gardenPlot" label="园地(亩)" align="center" header-align="center" />
        <el-table-column prop="forestLand" label="林地(亩)" align="center" header-align="center" />
        <el-table-column
          prop="trafficLand"
          label="交通运输用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="watersLand"
          label="水域及水利设施用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column prop="meadow" label="草地(亩)" align="center" header-align="center" />
        <el-table-column
          prop="commerceLand"
          label="商业服务业设施用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="mineLand"
          label="工矿用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="dwellingLand"
          label="住宅用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="serviceLand"
          label="公共管理与公共服务用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="facilityLand"
          label="公共设施用地(亩)"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="specialLand"
          label="特殊用地(亩)"
          align="center"
          header-align="center"
        />
      </el-table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElSpace, ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { getLandInfoApi } from '@/api/workshop/dataQuery/landInfo-service'
import { ParamsType } from '@/api/workshop/dataQuery/landInfo-types'
import { exportTypes } from '../config'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const tableDataList = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)
const emit = defineEmits(['export'])

const { tableObject } = useTable({
  getListApi: getLandInfoApi
})

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
        showCheckbox: false,
        checkStrictly: false,
        checkOnClickNode: false
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '村集体名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入村集体名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'type',
    label: '类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '请选择类型',
        options: [
          {
            label: '集体土地',
            value: 'collectiveness'
          },
          {
            label: '国有土地',
            value: 'stateOwned'
          }
        ]
      }
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

/**
 * 计算 table 的高度
 * @param arr 当前 table 的数据
 */
const getHeight = (arr: any) => {
  if (arr.length === 0) {
    return 150
  } else if (arr.length > 9) {
    return 500
  } else {
    return 'auto'
  }
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

/**
 * 获取表格数据
 * @param params 查询参数
 * villageCode 所属区域 code
 * householdName 村集体名称
 */
const getTableList = (params: ParamsType) => {
  loading.value = true
  getLandInfoApi(params)
    .then((res: any) => {
      if (res) {
        tableDataList.value = [...res]
      }
    })
    .finally(() => {
      loading.value = false
    })
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
  if (!params.type) {
    delete params.type
  }
  if (params.villageCode) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.villageCode, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.villageCode
      }
      getTableList({ ...params })
    })
  } else {
    delete params.villageCode
    getTableList({ ...params })
  }
}

// 重置
const resetSearch = () => {
  getTableList({})
}

// 数据导出
const onExport = () => {
  emit('export', villageTree.value, exportTypes.ground)
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

onMounted(() => {
  getVillageTree()
  getTableList({})
})
</script>
<style lang="less" scoped>
.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
