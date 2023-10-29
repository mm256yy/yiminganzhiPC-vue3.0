<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">系统配置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">安置点配置</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="table-wrap">
      <div class="row">
        <div class="col left"></div>
        <div class="col right">
          <ElButton type="primary" @click="onAddRow"> 新增 </ElButton>
        </div>
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
      >
        <template #regionText="{ row }">
          <div>
            {{
              `
              ${row.cityCodeText ? row.cityCodeText + '/' : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? '/' + row.townCodeText : ''}
              ${row.villageText ? '/' + row.villageText : ''}
              ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
              `
            }}
          </div>
        </template>
        <template #action="{ row }">
          <TableEditColumn
            :view-type="'link'"
            :row="row"
            @delete="onDelRow(row)"
            @edit="onEditRow(row)"
          />
        </template>
      </Table>
    </div>

    <!-- 编辑 -->
    <EditForm
      :show="dialog"
      :row="tableObject.currentRow"
      @close="onClose"
      :actionType="actionType"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElMessageBox } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import {
  getPlacementPointListApi,
  delPlacementPointByIdApi
} from '@/api/systemConfig/placementPoint-service'
import { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'

import EditForm from './EditForm.vue'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dialog = ref(false) // 查看弹窗标识
const districtTree = ref<any[]>([])
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const { register, tableObject, methods } = useTable({
  getListApi: getPlacementPointListApi,
  delListApi: delPlacementPointByIdApi
})

tableObject.params = {
  projectId,
  status: 'implementation'
}
const { setSearchParams } = methods

setSearchParams({})

const schema = reactive<CrudSchema[]>([
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
    field: 'address',
    label: '地理位置',
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
    width: 200,
    field: 'action',
    label: '操作',
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
  }
])

const { allSchemas } = useCrudSchemas(schema)

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
  // tableObject.currentRow = { ...row }
  tableObject.currentRow = row
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
        setSearchParams({})
      })
    })
    .catch(() => {})
}

// 关闭编辑弹窗
const onClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    setSearchParams({})
  }
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
