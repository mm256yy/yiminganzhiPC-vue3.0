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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="房屋" header-align="center">
          <el-table-column prop="state" label="幢号" header-align="center" />
          <el-table-column prop="city" label="结构" header-align="center" />
          <el-table-column prop="city" label="房屋层数" header-align="center" />
          <el-table-column prop="address" label="房屋建筑面积（m²）" header-align="center" />
          <el-table-column prop="address" label="备注" header-align="center" />
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="附属物" header-align="center">
          <el-table-column prop="state" label="序号" header-align="center" />
          <el-table-column prop="city" label="类型" header-align="center" />
          <el-table-column prop="address" label="单位" header-align="center" />
          <el-table-column prop="address" label="规格" header-align="center" />
          <el-table-column prop="address" label="数量" header-align="center" />
          <el-table-column prop="address" label="备注" header-align="center" />
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="零星林果木" header-align="center">
          <el-table-column prop="state" label="序号" header-align="center" />
          <el-table-column prop="city" label="品种" header-align="center" />
          <el-table-column prop="address" label="单位" header-align="center" />
          <el-table-column prop="address" label="规格" header-align="center" />
          <el-table-column prop="address" label="数量" header-align="center" />
          <el-table-column prop="address" label="备注" header-align="center" />
        </el-table-column>
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
import { getLandlordListApi } from '@/api/workshop/landlord/service'
import { screeningTree } from '@/api/workshop/village/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])

const tableData = ref<any[]>([])
const { tableObject, methods } = useTable({
  getListApi: getLandlordListApi
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

  // table字段 分割
  {
    field: '',
    label: '房屋',
    search: {
      show: false
    },
    children: [
      {
        field: 'name',
        label: '幢号',
        search: {
          show: false
        }
      },
      {
        field: 'name',
        label: '房屋层数',
        search: {
          show: false
        }
      },
      {
        field: 'name',
        label: '结构',
        search: {
          show: false
        }
      },
      {
        field: 'name',
        label: '房屋建筑面积',
        search: {
          show: false
        }
      },
      {
        field: 'name',
        label: '备注',
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
  emit('export', villageTree.value)
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
