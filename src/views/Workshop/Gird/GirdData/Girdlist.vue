<template>
  <ElDialog
    title="网格员列表"
    :model-value="props.show"
    :width="1000"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <WorkContentWrap>
      <div class="search-form-wrap">
        <Search
          :schema="allSchemas.searchSchema"
          expand
          :defaultExpand="false"
          :expand-field="'card'"
          @search="onSearch"
          @reset="setSearchParams"
        />
      </div>

      <div class="table-wrap">
        <Table
          selection
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
    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onClose">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { ElDialog, ElButton } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getLandlordListApi } from '@/api/AssetEvaluation/gird-service'
import { screeningTree, getVillageTreeApi } from '@/api/workshop/village/service'
import type { LandlordHeadInfoType } from '@/api/workshop/landlord/types'

import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
interface PropsType {
  show: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
}
const appStore = useAppStore()
const { push } = useRouter()
const projectId = appStore.currentProjectId
const villageTree = ref<any[]>([])
const districtTree = ref<any[]>([])
const headInfo = ref<LandlordHeadInfoType>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0
})
const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})
const { setSearchParams } = methods
tableObject.params = {
  projectId,
  status: 'implementation'
}

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
console.log(dictObj, '123')
// setSearchParams({ type: 'PeasantHousehold', status: SurveyStatusEnum.Implementation })
setSearchParams({ type: 'Village', status: SurveyStatusEnum.Implementation })
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'PeasantHousehold')
  villageTree.value = list || []
  return list || []
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
// tableObject
onMounted(() => {
  getVillageTree()
  getdistrictTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'blurry',
    label: '网格员',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入网格员名称'
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
    field: 'nickName',
    label: '网格员',
    search: {
      show: false
    }
  },
  {
    field: 'phone',
    label: '网格员手机号',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'peasantHouseholdNumber',
    label: '负责居民户数',
    search: {
      show: false
    }
  },
  {
    field: 'companyNumber',
    label: '负责企业',
    width: 190,
    search: {
      show: false
    }
  },
  {
    field: 'individualHouseholdNumber',
    label: '负责个体户',
    search: {
      show: false
    }
  },
  {
    field: 'villageNumber',
    label: '负责村集体',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

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
  console.log(params, '测试数据')
  if (!data.implementFillStatus) {
    Reflect.deleteProperty(params, 'implementFillStatus')
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
      params.type = 'Village'
      params.status = SurveyStatusEnum.Implementation
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'Village'
    params.status = SurveyStatusEnum.Implementation
    setSearchParams({ ...params })
  }
}
</script>

<style lang="less">
.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.red {
  color: #ff3939;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}
</style>
