<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">系统配置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">移民建卡项目配置</ElBreadcrumbItem>
    </ElBreadcrumb>
    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>
    <div class="table-wrap">
      <div class="right-field">
        <ElButton type="primary" @click="onAddRow"> 新增 </ElButton>
      </div>

      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="false"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #action="{ row }">
          <TableEditColumn :view-type="'link'" :row="row" @edit="onEditRow(row)" />
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
import { reactive, ref, computed } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Search } from '@/components/Search'
// import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { useDictStoreWithOut } from '@/store/modules/dict'
import EditForm from './EditForm.vue'
const dialog = ref(false) // 查看弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { register, tableObject, methods } = useTable()

const { setSearchParams } = methods

setSearchParams({})

const schema = reactive<CrudSchema[]>([
  {
    field: 'identityType',
    label: '身份类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[392]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'category',
    label: '类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '补偿费',
            value: '补偿费'
          },
          {
            label: '补助费',
            value: '补助费'
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'projectName',
    label: '项目名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入'
      }
    },
    table: {
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
    field: 'identityType',
    label: '身份类型',
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
    field: 'category',
    label: '类别',
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
    field: 'projectName',
    label: '项目名',
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
    field: 'projectIdentification',
    label: '项目标识',
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
    field: 'unit',
    label: '单位',
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
    field: 'unitPrice',
    label: '单价',
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
    field: 'unitPrice',
    label: '单价',
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
    field: 'needConfirm',
    label: '是否需要确认',
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
    field: 'createTime',
    label: '创建时间',
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

// const onDelRow = async (row: PlacementPointDtoType) => {
//   tableObject.currentRow = row
//   ElMessageBox.confirm('确定要删除该条数据？', '提示', {
//     dangerouslyUseHTMLString: true,

//     cancelButtonText: '取消',
//     confirmButtonText: '确认'
//   })
//     .then(() => {
//       delPlacementPointByIdApi(tableObject.currentRow?.id as number).then(() => {
//         setSearchParams({})
//       })
//     })
//     .catch(() => {})
// }

// 关闭编辑弹窗
const onClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    setSearchParams({})
  }
}
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

.right-field {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
