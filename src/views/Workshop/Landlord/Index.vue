<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">农户信息采集</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" size="18" />
          </div>
          <div class="text"
            >共<span class="num">{{ headInfo.peasantHouseholdNum || 10 }}</span
            >户<span class="distance"></span
            ><span class="num">{{ headInfo.demographicNum || 20 }}</span
            >人<span class="distance"></span>已上报<span class="num !text-[#30A952]">32</span
            ><span class="distance"></span>未上报<span class="num !text-[#F68418]">32</span>
          </div>
        </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加农户</ElButton>
          <ElButton :icon="printIcon" type="default" @click="onPrint">打印表格</ElButton>
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
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #locationType="{ row }">
          <div>{{ getLocationText(row.locationType) }}</div>
        </template>
        <template #filling="{ row }">
          <div class="filling-btn" @click="fillData(row)">数据填报</div>
        </template>
        <template #action="{ row }">
          <TableEditColumn
            :icons="[
              {
                icon: '',
                tooltip: '详情',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
            :row="row"
            @edit="onEditRow(row)"
            @delete="onDelRow"
          />
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :districtTree="villageTree"
      @close="onFormPupClose"
      @submit="onSubmit"
    />

    <Print :show="printDialog" @close="onPrintDialogClose" />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessage, ElSpace, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './components/EditForm.vue'
import Print from './components/Print.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getLandlordListApi,
  addLandlordApi,
  updateLandlordApi,
  delLandlordByIdApi,
  getLandlordHeadApi
} from '@/api/workshop/landlord/service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import { locationTypes } from './config'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
const villageTree = ref<any[]>([])
const headInfo = ref<any>({})
const printDialog = ref(false)

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})
const { getList, setSearchParams } = methods

const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})

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

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi()
  headInfo.value = info
}

onMounted(() => {
  getVillageTree()
  // getLandlordHeadInfo()
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
    field: 'card',
    label: '身份证号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'status',
    label: '上报状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '已上报',
            value: 1
          },
          {
            label: '未上报',
            value: 0
          }
        ]
      }
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
    field: 'cityCodeText',
    label: '区域名称(市县)',
    search: {
      show: false
    }
  },
  {
    field: 'townCodeText',
    label: '街道/乡镇',
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
    field: 'name',
    label: '户主姓名',
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
    field: 'phone',
    label: '联系方式',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户籍册编号',
    showOverflowTooltip: false,
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
    field: 'doorNo',
    label: '所属阶段',
    showOverflowTooltip: false,
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '填报状态',
    showOverflowTooltip: false,
    search: {
      show: false
    }
  },

  {
    field: 'address',
    label: '户籍所在地',
    search: {
      show: false
    }
  },
  {
    field: 'address',
    label: '所在位置',
    search: {
      show: false
    }
  },
  {
    field: 'filling',
    label: '填报',
    fixed: 'right',
    search: {
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
    Village: 'villageCode',
    naturalVillage: 'virutalVillageCode'
  }
  return map[key]
}

const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
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

const onPrint = () => {
  printDialog.value = true
}

const onPrintDialogClose = () => {
  printDialog.value = false
}

// 数据填报
const fillData = (row) => {
  console.log(row, 'row')
}

const onViewRow = (row) => {
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}
</script>

<style lang="less" scoped>
.filling-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  background: #e9f3ff;
  border-radius: 4px;
}
</style>
