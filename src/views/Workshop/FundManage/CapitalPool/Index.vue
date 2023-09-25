<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金池</ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 统计信息 -->
    <div class="statistics-wrap">
      <div class="item" @click="toLink('townshipFundEntry')">
        <div class="title">入账总金额(元)</div>
        <div class="content">121,000</div>
      </div>
      <div class="item center" @click="toLink('paymentApplication')">
        <div class="item-1">
          <div class="title">出账总金额(元)</div>
          <div class="content">1,100</div>
        </div>
        <div class="item-line"></div>
        <div class="item-2">
          <div>拨付总额 <span class="red">800</span> 元</div>
          <div>支付总额 <span class="red">300</span> 元</div>
        </div>
      </div>
      <div class="item">
        <div class="title">资金池余额(元)</div>
        <div class="content">2,000</div>
      </div>
    </div>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="row">
        <div class="col left">
          <div class="icon-box">
            <ElImage class="icon" :src="IconCapital" fit="cover" />
          </div>
          <div class="data-box">
            <span class="green">10</span> 笔 <span class="green">10,000</span> 元
          </div>
        </div>
        <div class="col right">
          <ElButton type="primary" @click="onExport">
            <Icon icon="fluent:arrow-export-up-24-regular" class="mr-5px" /> 导出
          </ElButton>
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

    <EditForm :show="dialog" :row="tableObject.currentRow" @close="onFormPupClose" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElImage } from 'element-plus'
import { Search } from '@/components/Search'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getLandlordListApi, delLandlordByIdApi } from '@/api/workshop/landlord/service'
import EditForm from './EditForm.vue'
import { MainType } from '@/types/print'
import IconCapital from '@/assets/imgs/icon_capital.png'

const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const projectId = appStore.currentProjectId
const dictObj = computed(() => dictStore.getDictObj)
const { push } = useRouter()
const dialog = ref(false) // 弹窗标识

const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi,
  delListApi: delLandlordByIdApi
})

const { setSearchParams } = methods

setSearchParams({ type: MainType.PeasantHousehold })

const schema = reactive<CrudSchema[]>([
  {
    field: 'type',
    label: '资金操作类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[387]
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
    field: 'fundName',
    label: '资金操作名称',
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
    field: 'operatonTime',
    label: '操作时间',
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
    label: '操作金额',
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
    field: 'typeText',
    label: '资金操作类型',
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
    label: '资金金额',
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
    field: 'operationTime',
    label: '操作时间',
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
    field: 'operationUser',
    label: '操作人',
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

const onViewRow = async (row) => {
  tableObject.currentRow = { ...row }
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

// 导出
const onExport = () => {}

/**
 * 跳转至指定页面
 * @param name 路由名称
 */
const toLink = (name: string) => {
  push({ name: name })
}
</script>

<style lang="less" scoped>
.statistics-wrap {
  display: flex;
  width: 100%;
  height: 144px;
  padding: 16px;
  margin-top: 5px;
  background-color: #fff;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 360px;
    height: 112px;
    cursor: pointer;
    background-color: #eef4ff;

    .title {
      font-size: 16px;
      line-height: 1;
      color: #333;
    }

    .content {
      margin-top: 10px;
      font-family: Helvetica-Bold, Helvetica;
      font-size: 32px;
      font-weight: bold;
      line-height: 1;
      color: #333;
    }

    &.center {
      flex-direction: row;
      width: calc(100% - 720px);
      margin: 0 20px;

      .item-line {
        width: 1px;
        height: 40px;
        margin: 0 20px;
        background-color: #ccdfff;
      }

      .item-2 {
        .red {
          color: #d9363e;
        }
      }
    }
  }
}

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

      .icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: #3472ff;

        .icon {
          width: 16px;
          height: 16px;
        }
      }

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
