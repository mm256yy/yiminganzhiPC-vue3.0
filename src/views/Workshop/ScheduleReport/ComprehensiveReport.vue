<template>
  <div class="flex items-center">
    <!-- <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton> -->
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">进度管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">专业项目</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">交通/电力/移动联通铁塔电信/文物</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="setSearchParams"
      />
      <!-- <ElButton type="primary" @click="onExport">数据导出</ElButton> -->
    </div>

    <div class="line"></div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 交通/电力/移动联通铁塔电信/文物 </div>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        border
        @register="register"
        :span-method="arraySpanMethod"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getGraveListApi } from '@/api/workshop/dataQuery/grave-service'
import { screeningTree } from '@/api/workshop/village/service'
import { exportTypes } from '../DataQuery/DataCollectionPublicity/config'
// import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
// const BackIcon = useIcon({ icon: 'iconoir:undo' })

const { register, tableObject, methods } = useTable({
  getListApi: getGraveListApi
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
    label: '户主姓名',
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
    field: 'doorNo',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '项目名称',
    search: {
      show: false
    }
  },
  {
    field: 'number',
    label: '专项类别',
    search: {
      show: false
    }
  },
  {
    field: 'materials',
    label: '责任单位',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '设计单位',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '监理单位',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '协议签订',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '开工',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '完工',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '验收',
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

/**
 * 合并单元行
 * @param{Object} row 当前行
 * @param{Object} column 当前列
 * @param{Object} rowIndex 当前行下标
 * @param{Object} columnInex 当前列下标
 */
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (column && columnIndex < 2) {
    const num = tableObject.tableList.filter((item) => item.doorNo === row.doorNo)?.length
    const index = tableObject.tableList.findIndex((item) => item.doorNo === row.doorNo)
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
  emit('export', villageTree.value, exportTypes.grave)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'amdinVillage')
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
