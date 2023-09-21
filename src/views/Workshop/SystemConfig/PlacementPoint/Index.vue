<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">系统配置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">安置点配置</ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="row">
        <div class="col left"></div>
        <div class="col right">
          <ElButton type="primary" @click="onAddRow"> 新增 </ElButton>
        </div>
      </div>

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
      >
        <template #action="{ row }">
          <ElButton type="primary" @click="onEditRow(row)"> 编辑 </ElButton>
          <ElButton type="primary" @click="onDelRow(row)"> 删除 </ElButton>
        </template>
      </Table>
    </div>

    <!-- 编辑 -->
    <EditForm :show="dialog" :row="tableObject.currentRow" @close="onClose" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElMessageBox } from 'element-plus'
import { Search } from '@/components/Search'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { MainType } from '@/types/print'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import {
  getPlacementPointListApi,
  delPlacementPointByIdApi
} from '@/api/systemConfig/placementPoint-service'
import { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'

import EditForm from './EditForm.vue'

const appStore = useAppStore()
// const dictStore = useDictStoreWithOut()
const projectId = appStore.currentProjectId
// const dictObj = computed(() => dictStore.getDictObj)
const dialog = ref(false) // 查看弹窗标识
const districtTree = ref<any[]>([])
const actionType = ref<'add' | 'edit'>('add') // 操作类型

const { register, tableObject, methods } = useTable({
  getListApi: getPlacementPointListApi,
  delListApi: delPlacementPointByIdApi
})

const { setSearchParams } = methods

setSearchParams({ type: MainType.PeasantHousehold })

const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '所属区域',
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
    field: 'residential',
    label: '小区名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入'
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },

  // table 字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
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
    field: 'name',
    label: '安置点名称',
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
    field: 'regionText',
    label: '所属区域',
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
    field: 'residential',
    label: '小区名称',
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
    field: 'landSpace',
    label: '用地面积(㎡)',
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
    field: 'floorSpace',
    label: '建筑面积(㎡)',
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
    width: 100,
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

tableObject.params = {
  projectId
}

const onSearch = (data) => {
  // 处理参数
  let params = { ...data }
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

  if (!params.card) {
    delete params.card
  }
  setSearchParams({ ...params, type: MainType.PeasantHousehold })
}

// 获取区域选项列表
const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}

// 新增
const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = async (row) => {
  actionType.value = 'edit'
  tableObject.currentRow = { ...row }
  dialog.value = true
}

const onDelRow = async (row: PlacementPointDtoType) => {
  tableObject.currentRow = row
  ElMessageBox.confirm('确定要删除该条数据？', '提示', {
    dangerouslyUseHTMLString: true,

    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
    .then(() => {
      delPlacementPointByIdApi(tableObject.currentRow?.id as number).then(() => {
        setSearchParams({ type: 'PeasantHousehold' })
      })
    })
    .catch(() => {})
}

// 关闭编辑弹窗
const onClose = () => {
  dialog.value = false
}

onMounted(() => {
  getdistrictTree()
})
</script>

<style lang="less" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .col {
    display: flex;
    align-items: center;

    &.left {
      width: 700px;
      height: 32px;
      background: linear-gradient(90deg, rgba(106, 191, 255, 0.19) 0%, rgba(67, 174, 255, 0) 100%);

      .data-box {
        margin-left: 10px;
        font-size: 14px;
        color: #171718;

        .green {
          font-family: Helvetica-Bold, Helvetica;
          font-size: 20px;
          font-weight: bold;
          color: #30a952;
        }
      }
    }
  }
}
</style>
