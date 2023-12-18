<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="resetSearch"
      />
      <ElButton type="primary" @click="onExport">数据导出</ElButton>
    </div>

    <div class="line"></div>
    <div class="table-wrap" v-loading="loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 房屋/附属物/零星林(果)木 </div>
      </div>
      <el-table :data="houseList" :height="getHeight(houseList)" style="width: 100%">
        <el-table-column label="房屋" header-align="center">
          <el-table-column prop="houseNo" label="幢号" align="center" header-align="center" />
          <el-table-column
            prop="storeyNumber"
            label="房屋层数"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="constructionTypeText"
            label="结构"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="landArea"
            label="房屋建筑面积（m²）"
            align="center"
            header-align="center"
          />
          <el-table-column prop="remark" label="备注" align="center" header-align="center" />
        </el-table-column>
      </el-table>
      <el-table :data="appendantList" :height="getHeight(appendantList)" style="width: 100%">
        <el-table-column label="附属物" header-align="center">
          <el-table-column prop="index" label="序号" align="center" header-align="center" />
          <el-table-column prop="name" label="类型" align="center" header-align="center" />
          <el-table-column prop="unitText" label="单位" align="center" header-align="center" />
          <el-table-column prop="sizeText" label="规格" align="center" header-align="center" />
          <el-table-column prop="number" label="数量" align="center" header-align="center" />
          <el-table-column prop="remark" label="备注" align="center" header-align="center" />
        </el-table-column>
      </el-table>
      <el-table :data="treeList" :height="getHeight(treeList)" style="width: 100%">
        <el-table-column label="零星林果木" header-align="center">
          <el-table-column prop="index" label="序号" align="center" header-align="center" />
          <el-table-column prop="name" label="品种" align="center" header-align="center" />
          <el-table-column prop="unitText" label="单位" align="center" header-align="center" />
          <el-table-column prop="sizeText" label="规格" align="center" header-align="center" />
          <el-table-column prop="number" label="数量" align="center" header-align="center" />
          <el-table-column prop="remark" label="备注" align="center" header-align="center" />
        </el-table-column>
      </el-table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElTable, ElTableColumn, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getVillageCollectiveListApi } from '@/api/workshop/dataQuery/villageCollective-service'
import { ParamsType } from '@/api/workshop/dataQuery/villageCollective-types'
import { screeningTree } from '@/api/workshop/village/service'
import { exportTypes } from '../config'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'

const titles = ['智能报表', '实物成果', '村集体', '房屋/附属物/零星林(果)木']

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])

const houseList = ref<any[]>([])
const appendantList = ref<any[]>([])
const treeList = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)

const { tableObject } = useTable({
  getListApi: getVillageCollectiveListApi
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

/**
 * 获取表格数据
 * @param params 查询参数
 * villageCode 所属区域 code
 * householdName 村集体名称
 */
const getTableList = (params: ParamsType) => {
  loading.value = true
  getVillageCollectiveListApi(params)
    .then((res: any) => {
      if (res) {
        houseList.value = res.houseList
        appendantList.value = res.appendantList
        treeList.value = res.treeList
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
  emit('export', villageTree.value, exportTypes.village)
}

// 获取所属区域数据(行政村列表)
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
  getTableList({})
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
