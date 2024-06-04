<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">法人资金池</ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 统计信息 -->
    <div class="statistics-wrap">
      <div class="item is-cursor" @click="toLink('LegalEntry')">
        <div class="title">入账总金额(元)</div>
        <div class="content">{{ accountData?.income }}</div>
      </div>
      <div class="item center">
        <div class="item-1">
          <div class="title">出账总金额(元)</div>
          <div class="content">{{ accountData?.expendTotal }}</div>
        </div>
        <div class="item-line"></div>
        <div class="item-2">
          <!-- <div>拨付总额 <span class="red">800</span> 元</div>
          <div>支付总额 <span class="red">300</span> 元</div> -->
          <div>
            <a class="a-revert" @click="toLink('FundAllocation')" href="javascript:void(0);"
              >拨付总额 {{ accountData?.receipt }}元</a
            >
          </div>
          <div>
            <a class="a-revert" @click="toLink('FundPayment ')" href="javascript:void(0);"
              >支付总额 {{ accountData?.pay }}元</a
            >
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">资金池余额(元)</div>
        <div class="content">{{ accountData?.balance }}</div>
      </div>
    </div>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>

    <div class="table-wrap">
      <!-- <div class="row">
        <div class="col left">
          <div class="icon-box">
            <ElImage class="icon" :src="IconCapital" fit="cover" />
          </div>
          <div class="data-box">
            <span class="green">共{{ tableObject.total }}</span> 笔
          </div>
        </div>
        <div class="col right">
          <ElButton type="primary" @click="onExport">
            <Icon icon="fluent:arrow-export-up-24-regular" class="mr-5px" /> 导出
          </ElButton>
        </div>
      </div> -->

      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">资金记录</span>

          <div class="text">
            合计金额： <span class="num">{{ sumAmount || 0 }}</span> 元
          </div>
        </div>
        <ElSpace>
          <!-- <ElButton :icon="addIcon" type="primary" @click="onAddRow"> 添加 </ElButton> -->
          <!-- <ElButton :icon="importIcon" type="default" @click="onExport"> 导出 </ElButton> -->
        </ElSpace>
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
        show-overflow-tooltip
        @register="register"
      >
        <template #typeTxt="{ row }">
          <div>{{ row.type === 'income' ? '入账' : row.type === 'receipt' ? '拨付' : '支付' }}</div>
        </template>
        <template #recordTime="{ row }">
          <div>{{
            row.recordTime ? dayjs(row.recordTime).format('YYYY-MM-DD HH:mm:ss') : '-'
          }}</div>
        </template>
        <template #createdDate="{ row }">
          <div>{{
            row.createdDate ? dayjs(row.createdDate).format('YYYY-MM-DD HH:mm:ss') : '-'
          }}</div>
        </template>
        <template #action="{ row }">
          <ElButton type="primary" @click="onViewRow(row)"> 查看 </ElButton>
        </template>
      </Table>
    </div>
    <EditForm :show="dialog" :id="doorNo" @close="onFormPupClose" />
    <TypeFour
      :show="dialogs"
      @close="onEditFormClose"
      :actionType="'view'"
      :row="parmasList"
      :parmasList="parmasList"
      :fundAccountList="fundAccountList"
      ref="vill"
    />
    <!-- <EditForm :show="dialog" :row="tableObject.currentRow" @close="onFormPupClose" /> -->
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElImage } from 'element-plus'
import { Search } from '@/components/Search'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import type { CapitalPoolDtoType, CapitalPoolAccount } from '@/api/fundManage/capitalPool-types'
import {
  getCapitalPoolListApiLegal,
  getCapitalPoolApiLegal,
  getpoolSumAmountLegal
} from '@/api/fundManage/capitalPool-service'
// import EditForm from './EditForm.vue'
import TypeFour from '@/views/Workshop/FundManage/PaymentApplication/EditForm.vue'
import IconCapital from '@/assets/imgs/icon_capital.png'
import dayjs from 'dayjs'
import EditForm from './addForm.vue'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import { PaymentApplicationByIdDetailApi } from '@/api/fundManage/paymentApplication-service'
import { useAppStore } from '@/store/modules/app'
const { push } = useRouter()
const dialog = ref(false) // 弹窗标识
const accountData = ref<CapitalPoolAccount>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const sumAmount = ref<string>('')

const { register, tableObject, methods } = useTable({
  getListApi: getCapitalPoolListApiLegal
})

const { getList, setSearchParams } = methods

tableObject.params = {
  // status: 1
  projectId
}

getList()

const onSearch = (data) => {
  let params = {
    ...data
  }

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  setSearchParams({ ...params })
  sumAmountApi({ ...params })
}

const onReset = () => {
  tableObject.params = {
    projectId
    // status: 1
  }
  setSearchParams({})
  sumAmountApi({ projectId })
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'type',
    label: '资金操作类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '入账',
            value: 'income'
          },
          {
            label: '拨付',
            value: 'receipt'
          },
          {
            label: '支付',
            value: 'pay'
          }
        ]
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
    field: 'recordTime',
    label: '操作时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD'
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
    field: 'amount',
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
    field: 'name',
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
    field: 'typeTxt',
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
    field: 'amnt',
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
    field: 'record_time',
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
    field: 'created_date',
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
    field: 'created_by',
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
let doorNo = ref()
let parmasList = ref()
const onViewRow = (row) => {
  console.log(row, row.type)

  if (row.type == 'income') {
    // 入账
    toLink('LegalEntryIndex', row.id)
  } else if (row.type == 'receipt') {
    // 拨付
    toLink('LegalPoolReceipt', row.id)
  } else if (row.type == 'pay') {
    // 支付
    toLink('LegalPoolPay', row.id)
  }
}

const onFormPupClose = () => {
  dialog.value = false
}
let dialogs = ref(false)
const onEditFormClose = (flag: boolean) => {
  if (flag) {
    getList()
  }
  dialogs.value = false
}
// 导出
// const onExport = () => {}

const sumAmountApi = async (params) => {
  try {
    sumAmount.value = await getpoolSumAmountLegal({
      ...params,
      projectId
      // type: '1'
      // entryStatus: '1'
    })
  } catch (error) {}
}

onMounted(() => {
  getCapitalPoolApiLegal().then((res) => {
    accountData.value = res
  })
  sumAmountApi({})
  getFundSubjectList()
})

/**
 * 跳转至指定页面
 * @param name 路由名称
 */
const toLink = (name: string, id?: string | number) => {
  push({ name: name, query: { id } })
}
// 获取资金科目选项列表
let fundAccountList = ref()
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
      console.log(fundAccountList.value, '资金列表数据')
    }
  })
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

  .is-cursor {
    cursor: pointer;
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

.a-revert {
  text-decoration: revert;
}
</style>
