<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">概算调整</ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="row">
        <div class="col left">
          <div class="data-box"> 合计金额： <span class="green">10,000</span> 元 </div>
        </div>
        <div class="col right">
          <ElButton type="primary" @click="onAdjust"> 调整概算 </ElButton>
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
          <ElButton type="primary" @click="onViewRow(row)"> 查看 </ElButton>
        </template>
      </Table>
    </div>

    <!-- 查看 -->
    <ViewForm :show="dialog" :row="tableObject.currentRow" @close="onCloseView" />

    <!-- 概算调整 -->
    <AdjustForm
      :show="adjustDialog"
      :row="tableObject.currentRow"
      :selectionIds="getSelections"
      @close="onCloseAdjust"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { Search } from '@/components/Search'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { MainType } from '@/types/print'
import { getLandlordListApi, delLandlordByIdApi } from '@/api/workshop/landlord/service'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import ViewForm from './ViewForm.vue'
import AdjustForm from './AdjustForm.vue'

const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const projectId = appStore.currentProjectId
const dictObj = computed(() => dictStore.getDictObj)
const dialog = ref(false) // 查看弹窗标识
const adjustDialog = ref(false) // 调整概算弹窗标识
const fundAccountList = ref<any[]>([]) // 资金科目

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})

const { setSearchParams, getSelections } = methods

setSearchParams({ type: MainType.PeasantHousehold })

const schema = reactive<CrudSchema[]>([
  {
    field: 'type',
    label: '申请类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[381]
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
  {
    field: 'status',
    label: '状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[386]
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
  {
    field: 'name',
    label: '申请名称',
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
  {
    field: 'applyDate',
    label: '申请时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
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
  {
    field: 'price',
    label: '申请金额',
    search: {
      show: true,
      component: 'InputRange'
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
  {
    field: 'classify',
    label: '概算科目',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[382]
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
  {
    field: 'fundAccount',
    label: '资金科目',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: fundAccountList,
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
    field: 'fundName',
    label: '资金名称',
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
    field: 'fundSource',
    label: '资金来源',
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
    field: 'paymentType',
    label: '付款对象类型',
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
    field: 'estimateSubject',
    label: '概算科目',
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
    field: 'fundSubject',
    label: '资金科目',
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
    field: 'amount',
    label: '资金金额(元)',
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
    field: 'applyType',
    label: '申请类别',
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
    field: 'createDate',
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
    field: 'applyUser',
    label: '申请人',
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
    field: 'status',
    label: '状态',
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

// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
    }
  })
}

const onViewRow = async (row) => {
  tableObject.currentRow = { ...row }
  dialog.value = true
}

// 调整概算
const onAdjust = () => {
  adjustDialog.value = true
}

// 关闭查看弹窗
const onCloseView = () => {
  dialog.value = false
}

// 关闭概算调整弹窗
const onCloseAdjust = (flag: boolean) => {
  adjustDialog.value = false
  if (flag === true) {
    setSearchParams({ type: MainType.PeasantHousehold })
  }
}

onMounted(() => {
  getFundSubjectList()
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
