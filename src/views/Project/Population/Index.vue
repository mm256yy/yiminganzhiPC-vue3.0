<template>
  <ContentWrap title="人口信息登记">
    <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px"> 人口信息列表 </div>
      <ElSpace>
        <!-- <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增人口</ElButton> -->
        <ElButton :icon="downloadIcon" type="default" @click="onDownloadTemplate">按钮区</ElButton>
        <!-- todo 未确定 -->
        <!-- <ElUpload
          action="/api/peasantHousehold/import"
          :headers="headers"
          :data="{ projectId }"
          :show-file-list="false"
          accept=".xls,.xlsx"
        >
          <template #trigger>
            <ElButton :icon="importIcon" type="primary">批量导入</ElButton>
          </template>
        </ElUpload>
        <ElUpload
          action="/api/peasantHousehold/import"
          :headers="headers"
          :data="{ projectId }"
          :show-file-list="false"
          accept=".xls,.xlsx"
        >
          <template #trigger>
            <ElButton :icon="importIcon" type="primary">追加导入</ElButton>
          </template>
        </ElUpload> -->
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
import { ElButton, ElMessage, ElMessageBox, ElSpace, ElUpload } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getDemographicListApi,
  addDemographicApi,
  updateDemographicApi,
  delDemographicByIdApi
} from '@/api/project/population/service'
import { getVillageTreeApi } from '@/api/project/village/service'
import type { DemographicDtoType } from '@/api/project/population/types'

// type LabelValueType = { label: string; id: number; children?: LabelValueType[] }

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const downloadIcon = useIcon({ icon: 'ant-design:cloud-download-outlined' })
// const importIcon = useIcon({ icon: 'ant-design:import-outlined' })
const villageTree = ref<any[]>([])

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList, setSearchParams } = methods

// const headers = ref({
//   'Project-Id': projectId,
//   Authorization: appStore.getToken
// })

tableObject.params = {
  projectId
}

getList()

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
  getVillageTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCode',
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
    field: 'relation',
    label: '与户主关系',
    search: {
      show: false
    }
  },
  {
    field: 'sex',
    label: '性别',
    search: {
      show: false
    }
  },
  {
    field: 'birthday',
    label: '出生年月日',
    search: {
      show: false
    }
  },
  {
    field: 'nation',
    label: '民族',
    search: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户籍册编码',
    search: {
      show: false
    }
  },
  {
    field: 'censusRegister',
    label: '户籍所在地',
    search: {
      show: false
    }
  },
  {
    field: 'education',
    label: '文化程度',
    search: {
      show: false
    }
  },
  {
    field: 'marital',
    label: '婚姻状况',
    search: {
      show: false
    }
  },
  {
    field: 'censusType',
    label: '户籍类别',
    search: {
      show: false
    }
  },
  {
    field: 'populationType',
    label: '人口类型',
    search: {
      show: false
    }
  },
  {
    field: 'occupation',
    label: '职业',
    search: {
      show: false
    }
  },
  {
    field: 'company',
    label: '工作单位',
    search: {
      show: false
    }
  },
  {
    field: 'comeTime',
    label: '何时迁来',
    search: {
      show: false
    }
  },
  {
    field: 'comeCause',
    label: '何因来本市',
    search: {
      show: false
    }
  },
  {
    field: 'comeAddressTime',
    label: '何时来本址',
    search: {
      show: false
    }
  },
  {
    field: 'comeAddressCause',
    label: '何因来本址',
    search: {
      show: false
    }
  },
  {
    field: 'fromTown',
    label: '何省县来本址',
    search: {
      show: false
    }
  },
  {
    field: 'fromAddress',
    label: '何详址来本址',
    search: {
      show: false
    }
  },
  {
    field: 'villageText',
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'virutalVillageText',
    label: '自然村',
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

const onDelRow = async (row: DemographicDtoType | null, multiple: boolean) => {
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

const onEditRow = (row: DemographicDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: DemographicDtoType) => {
  if (actionType.value === 'add') {
    await addDemographicApi({
      ...data,
      projectId
    })
  } else {
    await updateDemographicApi({
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
    naturalVillage: 'villageCode'
  }
  return map[key]
}

const onSearch = (data) => {
  console.log(data, '------')
  // 处理参数
  let params = {
    ...data
  }
  if (params.villageCode) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.villageCode, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.villageCode
      }
      delete params.villageCode
      setSearchParams(params)
    })
  } else {
    delete params.villageCode
    setSearchParams(params)
  }
}

const onDownloadTemplate = () => {}
</script>
