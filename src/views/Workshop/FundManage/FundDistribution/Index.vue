<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金发放</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="ElButton-form-wrap">
      <ElButton type="primary" @click="selenceTable('居民户')"> 居民户 </ElButton>
      <ElButton type="primary" @click="selenceTable('企（事）业单位')"> 企（事）业单位 </ElButton>
      <ElButton type="primary" @click="selenceTable('个体户')"> 个体户 </ElButton>
      <ElButton type="primary" @click="selenceTable('村集体')"> 村集体 </ElButton>
    </div>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 14px; font-weight: 600">付款申请记录</span>

          <div class="text">
            已完成：0笔
            <span class="num">{{ molingData.issuedAmount }}</span> 元
          </div>
          <div class="text">
            审核中：0笔
            <span class="num">{{ molingData.pendingAmount }}</span> 元
          </div>
          <div class="text">
            待提交：0笔
            <span class="num">{{ molingData.totalPrice }}</span> 元
          </div>
        </div>
        <ElSpace>
          <ElButton type="primary" @click="IssueClick"> 发放 </ElButton>
        </ElSpace>
      </div>
      <Table
        ref="tabalRef"
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
        :selection="true"
        highlightCurrentRow
        @register="register"
      >
        <template #villageText="{ row }">
          <div>{{
            (row.cityCodeText ? row.cityCodeText + '/' : '') +
            (row.areaCodeText ? row.areaCodeText + '/' : '') +
            (row.townCodeText ? row.townCodeText + '/' : '') +
            (row.villageText ? row.villageText : '')
          }}</div>
        </template>

        <template #grantTime="{ row }">
          <div>{{ row.grantTime ? dayjs(row.grantTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div>
        </template>
        <template #type="{ row }">
          <div>{{ `第${row.type}批次` }}</div>
        </template>
        <template #grantStatus="{ row }">
          <div>{{ row.grantStatus == '1' ? '已放款' : '未放款' }}</div>
        </template>
      </Table>
    </div>

    <!-- <EditForm :show="dialog" @close="onEditFormClose" /> -->
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElMessage, ElMessageBox } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import {
  getFunAmountGrant,
  deleteFunPayApi,
  getLpListApi,
  getFunPaySumAmountApi,
  getSumAmount,
  postGrant
} from '@/api/fundManage/fundPayment-service'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { getVillageTreeApi } from '@/api/workshop/village/service'
const appStore = useAppStore()
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
const projectId = appStore.currentProjectId
let tabalRef = ref()
const headInfo = ref<any>()
const districtTree = ref<any[]>([])
const lpList = ref<any[]>([])
const goObject = reactive<any>({
  state: [
    { label: '已发放', value: '1' },
    { label: '待发放', value: '0' }
  ],
  batch: [
    { label: '第一批', value: '1' },
    { label: '第二批次', value: '2' },
    { label: '第三批次', value: '3' },
    { label: '第四批次', value: '4' }
  ]
})
let molingData = ref<any>({
  issuedAmount: 0,
  pendingAmount: 0,
  totalPrice: 0
})
const { register, tableObject, methods } = useTable({
  getListApi: getFunAmountGrant,
  delListApi: deleteFunPayApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getHeadInfo = async () => {
  const info = await getFunPaySumAmountApi()
  headInfo.value = info
}

const getLpListHandle = async () => {
  const res: any = await getLpListApi()
  if (res && res.length) {
    lpList.value = res
  }
}
const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
let moneyList = async () => {
  let list = await getSumAmount({ projectId: projectId })
  molingData.value = list
  console.log(molingData)
}
onMounted(() => {
  moneyList()
  getHeadInfo()
  getLpListHandle()
  getdistrictTree()
  console.log(tableObject)
})

const selenceTable = (e: string) => {
  console.log(e)
  schema.forEach((item: any) => {
    if (item.field == 'name') {
      item.label = e
    }
  })

  allSchemas = useCrudSchemas(schema).allSchemas
  console.log(allSchemas)
  tabalRef.value.setColumns(allSchemas.tableColumns)
}
const IssueClick = () => {
  console.log(tabalRef.value.selections)
  let all = 0
  let pamaers = tabalRef.value.selections.reduce((pre, item) => {
    pre.push({
      type: item.type,
      doorNo: item.doorNo,
      status: '1'
    })
    all += item.pendingAmount
    return pre
  }, [])
  ElMessageBox.confirm(`本次发放共${pamaers.length}户居民户，共${all}元。请确认是否发放`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      console.log(pamaers)
      postGrant(pamaers).then(() => {
        ElMessage({
          type: 'success',
          message: '发放成功'
        })
        getList()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'success',
        message: '取消成功'
      })
    })
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'cityCode',
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
    field: 'name',
    label: '姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '可输入姓名 / 户号 / 联系方式'
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
    field: 'cardType',
    label: '发放批次',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: goObject.batch
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
    field: 'cardStatus',
    label: '发放状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: goObject.state
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
    field: 'grantTime',
    label: '发放时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'datetime'
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
  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    width: 160,
    field: 'name',
    label: '户主姓名',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'doorNo',
    label: '户号',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'villageText',
    label: '所属区域',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'type',
    label: '发放批次',
    search: {
      show: false
    }
  },
  {
    field: 'grantStatus',
    label: '发放状态',
    search: {
      show: false
    }
  },

  {
    field: 'pendingAmount',
    label: '可发放金额（元）',
    search: {
      show: false
    }
  },
  {
    field: 'grantTime',
    label: '发放日期',
    search: {
      show: false
    }
  }
])

let { allSchemas } = useCrudSchemas(schema)

const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))

  if (searchData.relation == '1') {
    searchData.relation = ['is', 1]
  } else if (searchData.relation == '0') {
    searchData.relation = ['not', 1]
  } else {
    delete searchData.relation
  }
  console.log(searchData)
  // 处理参数
  let params = {
    ...searchData
  }
  tableObject.params = {
    projectId
  }
  if (params.grantTime) {
    params.grantTime = [params.grantTime]
  }
  for (let i in params) {
    if (!params[i]) {
      delete params[i]
    }
  }
  setSearchParams({ ...params })
}
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}

.ElButton-form-wrap {
  display: block;
  padding: var(--distance-base);
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.numFont {
  font-size: 14px;
}
</style>
