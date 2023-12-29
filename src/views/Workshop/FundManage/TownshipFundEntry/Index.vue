<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">乡镇资金入账</ElBreadcrumbItem>
    </ElBreadcrumb>
    <!-- 统计信息 -->
    <div class="fund-entry-wrap">
      <div class="item">
        <div class="title">预付款</div>
        <div class="content-wrapper">
          <div class="content">
            <div class="sub-title">入账金额</div>
            <div class="amount">{{ amountItem?.allAmount }}&nbsp;元</div>
          </div>
          <div class="content">
            <div class="sub-title">余额</div>
            <div class="amount">{{ amountItem?.pendingAmount }}&nbsp;元</div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">发放款</div>
        <div class="content-wrapper">
          <div class="content">
            <div class="sub-title">发放金额</div>
            <div class="amount">{{ amountItem?.issuedAmount }}&nbsp;元</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">乡镇资金入账列表</span>
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            总共 <span class="num">{{ tableObject.total }}</span> 个
          </div>
        </div>
        <div class="table-header-right">
          <!-- <ElButton :icon="importIcon" type="primary" @click="onExport">导出</ElButton> -->
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
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        showOverflowTooltip
        @register="register"
      >
        <template #paymentTime="{ row }">
          {{ formatTime(row.paymentTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <!-- <template #action="{ row }">
          <ElButton link type="primary" @click="onCheckRow(row)">查看</ElButton>
        </template> -->
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useAppStore } from '@/store/modules/app'
// import { useRouter } from 'vue-router'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { Search } from '@/components/Search'
import {
  getFunPayTownshipListApi,
  getTownshipSumAmount
} from '@/api/fundManage/townshipFundEntry-service'
import type { AmountDtoType } from '@/api/fundManage/townshipFundEntry-types'
import { formatTime } from '@/utils/index'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const importIcon = useIcon({ icon: 'ant-design:import-outlined' })
const amountItem = ref<AmountDtoType>()

const { register, tableObject, methods } = useTable({
  getListApi: getFunPayTownshipListApi
})
let fundAccountList = ref<any[]>([])
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const onSearch = (data) => {
  let params = {
    ...data
  }

  setSearchParams({ ...params })
}

const onReset = () => {
  tableObject.params = {}
  setSearchParams({})
}

// 导出
const onExport = async () => {
  // const res = await getExportApi({ peasantHouseholdType: props.type, type: checkList.value })
  // let filename = res.headers
  // filename = filename['content-disposition']
  // filename = filename.split(';')[1].split('filename=')[1]
  // filename = decodeURIComponent(filename)
  // let elink = document.createElement('a')
  // document.body.appendChild(elink)
  // elink.style.display = 'none'
  // elink.download = filename
  // let blob = new Blob([res.data])
  // const URL = window.URL || window.webkitURL
  // elink.href = URL.createObjectURL(blob)
  // elink.click()
  // document.body.removeChild(elink)
  // URL.revokeObjectURL(elink.href)
}
// const { push } = useRouter()

const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '资金名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '资金名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'type',
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
    }
  },
  {
    field: 'funSubjectId',
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
  {
    field: 'paymentTime',
    label: '入账时间',
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
    }
  },
  {
    field: 'amount',
    label: '资金金额',
    search: {
      show: true,
      component: 'InputRange'
    },
    table: {
      show: false
    }
  },
  {
    field: 'payType',
    label: '资金类别',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[389]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'paymentType',
    label: '付款对象类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[385]
      }
    },
    table: {
      show: false
    }
  },
  // table字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '资金名称',
    search: {
      show: false
    }
  },
  {
    field: 'paymentTypeText',
    label: '付款对象类别',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'typeText',
    label: '概算科目',
    search: {
      show: false
    }
  },
  {
    field: 'funSubjectIdText',
    label: '资金科目',
    search: {
      show: false
    }
  },
  {
    field: 'amount',
    label: '资金金额（元）',
    search: {
      show: false
    }
  },
  {
    field: 'payTypeText',
    label: '资金类别',
    search: {
      show: false
    }
  },
  {
    field: 'paymentTime',
    label: '入账时间',
    search: {
      show: false
    }
  }
  // {
  //   field: 'action',
  //   label: '操作',
  //   fixed: 'right',
  //   width: 120,
  //   search: {
  //     show: false
  //   },
  //   form: {
  //     show: false
  //   },
  //   detail: {
  //     show: false
  //   }
  // }
])

const { allSchemas } = useCrudSchemas(schema)

// // 查看
// const onCheckRow = (row) => {
//   push({
//     name: 'townshipFundEntryCheck',
//     query: {
//       householdId: row.id,
//       doorNo: row.doorNo,
//       type: 0
//     }
//   })
// }

const getSumAmount = () => {
  getTownshipSumAmount().then((res) => {
    amountItem.value = res
  })
}
// 获取资金科目选项列表

const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
      console.log(fundAccountList, '资金测试')
    }
  })
}
onMounted(() => {
  getSumAmount()
  getFundSubjectList()
})
</script>

<style lang="less" scoped>
.fund-entry-wrap {
  display: flex;
  width: 100%;
  height: 144px;
  margin-top: 10px;
  background: #ffffff;
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;

  .item {
    display: flex;
    justify-content: space-between;
    width: 50%;
    height: 112px;
    margin: 0 20px;
    background: #eef4ff;
    border-radius: 4px;

    .title {
      display: flex;
      width: 100px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      background: rgba(59, 130, 246, 0.9);
      justify-content: center;
      align-items: center;
    }

    .content-wrapper {
      display: flex;
      align-items: center;
      width: calc(100% - 100px);

      .content {
        display: flex;
        width: 33.3%;
        flex-direction: column;
        align-items: center;

        .sub-title {
          padding-bottom: 5px;
          font-size: 16px;
          font-weight: 400;
          color: #333333;
        }

        .amount {
          font-size: 18px;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
}

.search-form-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}
</style>
