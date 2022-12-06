<template>
  <ContentWrap title="农户信息登记">
    <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px"> 户主信息列表 </div>
      <ElSpace>
        <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增人口</ElButton>
        <ElButton :icon="downloadIcon" type="default" @click="onDownloadTemplate"
          >模版下载</ElButton
        >
        <ElButton :icon="importIcon" type="primary" @click="onBatchImport">批量导入</ElButton>
        <ElButton :icon="importIcon" type="primary" @click="onAppendImport">追加导入</ElButton>
      </ElSpace>
    </div>
    <Table
      border
      v-model:pageSize="tableObject.size"
      v-model:currentPage="tableObject.currentPage"
      :pagination="{
        total: tableObject.total
      }"
      :loading="tableObject.loading"
      :data="tableObject.tableList"
      :columns="allSchemas.tableColumns"
      tableLayout="auto"
      row-key="id"
      headerAlign="center"
      align="center"
      highlightCurrentRow
      @register="register"
    >
      <template #longitude="{ row }">
        <div>{{ row.longitude || '-' }}</div>
        <div>{{ row.latitude || '-' }}</div>
      </template>
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditRow(row)" @delete="onDelRow" />
      </template>
    </Table>
    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :districtTree="villageTree"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessage, ElMessageBox, ElSpace } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getLandlordListApi,
  addLandlordApi,
  updateLandlordApi,
  delLandlordByIdApi
} from '@/api/project/landlord/service'
import { getDistrictTreeApi } from '@/api/district'
import { getVillageTreeApi } from '@/api/project/village/service'
import type { LandlordDtoType } from '@/api/project/landlord/types'

// type LabelValueType = { label: string; id: number; children?: LabelValueType[] }

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const downloadIcon = useIcon({ icon: 'ant-design:cloud-download-outlined' })
const importIcon = useIcon({ icon: 'ant-design:import-outlined' })
const districtTree = ref([])
const villageTree = ref<any[]>([])

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getDistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

const getVillageTree = async () => {
  const list = await getVillageTreeApi(projectId)
  console.log(list, 'village list')
  villageTree.value = list || []
  return list || []
}

onMounted(() => {
  // 权限限制
  if (!appStore.getIsProjectAdmin && !appStore.getIsSysAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {
        window.location.href = '/#/dashboard/home'
      })
    return
  }
  getDistrictTree()
  getVillageTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageId',
    label: '行政区划',
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
    field: 'blurry',
    label: '户主/户号/联系方式',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    }
  },
  {
    field: 'index',
    type: 'index',
    label: '序号'
  },

  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户号',
    showOverflowTooltip: false,
    search: {
      show: false
    }
  },
  {
    field: 'neighborhoodCommittee',
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'villageId',
    label: '自然村',
    search: {
      show: false
    }
  },
  {
    field: 'phone',
    label: '联系方式',
    search: {
      show: false
    }
  },
  {
    field: 'locationType',
    label: '区域类型',
    search: {
      show: false
    }
  },
  {
    field: 'address',
    label: '具体位置',
    search: {
      show: false
    }
  },
  {
    field: 'longitude',
    label: '经纬度',
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: '100px',
    search: {
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

const onDelRow = async (row: LandlordDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = (row: LandlordDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: LandlordDtoType) => {
  if (actionType.value === 'add') {
    await addLandlordApi({
      ...data,
      projectId
    })
  } else {
    await updateLandlordApi({
      ...data,
      id: tableObject.currentRow?.id as number,
      projectId
    })
  }
  ElMessage.success('操作成功！')
  dialog.value = false
  getList()
}

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
    Village: 'neighborhoodCommittee',
    naturalVillage: 'villageId'
  }
  return map[key]
}

const onSearch = (data) => {
  console.log(data, '------')
  // 处理参数
  let params = {
    ...data
  }
  if (params.villageId) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.villageId, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.villageId
      }
      delete params.villageId
      setSearchParams(params)
    })
  } else {
    delete params.villageId
    setSearchParams(params)
  }
}

const onDownloadTemplate = () => {}
const onBatchImport = () => {}
const onAppendImport = () => {}
</script>
