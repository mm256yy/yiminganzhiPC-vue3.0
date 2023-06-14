<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="line"></div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div></div>
        <ElSpace>
          <ElButton type="primary" @click="onExport">数据导出</ElButton>
        </ElSpace>
      </div>

      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElSpace } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { getLandInfoApi } from '@/api/workshop/dataQuery/landInfo-service'
import { exportTypes } from '../config'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])

const { register, tableObject, methods } = useTable({
  getListApi: getLandInfoApi
})

const { setSearchParams } = methods

const villageTree = ref<any[]>([])

tableObject.params = {
  projectId
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
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
    field: 'name',
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
  },

  // table字段 分割
  {
    field: 'name',
    label: '地类',
    search: {
      show: false
    }
  },
  {
    field: 'plowland',
    label: '耕地',
    search: {
      show: false
    }
  },
  {
    field: 'gardenPlot',
    label: '园地',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'forestLand',
    label: '林地',
    search: {
      show: false
    }
  },
  {
    field: 'trafficLand',
    label: '交通运输用地',
    search: {
      show: false
    }
  },
  {
    field: 'watersLand',
    label: '水域及水利设施用地',
    search: {
      show: false
    }
  },
  {
    field: 'meadow',
    label: '草地',
    search: {
      show: false
    }
  },
  {
    field: 'commerceLand',
    label: '商业服务设施用地',
    search: {
      show: false
    }
  },
  {
    field: 'mineLand',
    label: '工矿用地',
    search: {
      show: false
    }
  },
  {
    field: 'dwellingLand',
    label: '住宅用地',
    search: {
      show: false
    }
  },
  {
    field: 'serviceLand',
    label: '公共管理与公共服务用地',
    search: {
      show: false
    }
  },
  {
    field: 'facilityLand',
    label: '公用设施用地',
    search: {
      show: false
    }
  },
  {
    field: 'specialLand',
    label: '特殊用地',
    search: {
      show: false
    }
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

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  if (!data.reportStatus) {
    Reflect.deleteProperty(params, 'reportStatus')
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  if (!params.hasPropertyAccount) {
    delete params.hasPropertyAccount
  }
  if (!params.fillStatus) {
    delete params.fillStatus
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }

      params.type = 'PeasantHousehold'
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'PeasantHousehold'

    setSearchParams({ ...params })
  }
}

// 数据导出
const onExport = () => {
  emit('export', villageTree.value, exportTypes.ground)
}

const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'village')
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
  setSearchParams({ type: 'PeasantHousehold' })
})
</script>
<style lang="less" scoped>
.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
