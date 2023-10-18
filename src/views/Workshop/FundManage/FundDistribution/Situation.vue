<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金发放情况</ElBreadcrumbItem>
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
            <span class="num">0</span> 元
          </div>
          <div class="text">
            审核中：0笔
            <span class="num">0</span> 元
          </div>
          <div class="text">
            待提交：0笔
            <span class="num">0</span> 元
          </div>
        </div>
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
        highlightCurrentRow
        @register="register"
      >
        <template #createTime="{ row }">
          <div>{{
            row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
          }}</div>
        </template>

        <template #paymentTime="{ row }">
          <div>{{
            row.paymentTime ? dayjs(row.paymentTime).format('YYYY-MM-DD HH:mm:ss') : '-'
          }}</div>
        </template>
        <template #action>
          <el-button type="primary" link>查看</el-button>
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      @close="onEditFormClose"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import EditForm from './EditForm.vue'
import {
  getFunPayListApi,
  deleteFunPayApi,
  getLpList,
  getFunPaySumAmount
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
const actionType = ref<'view' | 'add' | 'edit'>('add')
const dialog = ref<boolean>(false)
const goObject = reactive<any>({
  state: [
    { label: '已发放', value: '1' },
    { label: '未发放', value: '2' }
  ],
  batch: [
    { label: '第一批', value: '1' },
    { label: '第二批', value: '2' },
    { label: '全部', value: '3' }
  ]
})
const { register, tableObject, methods } = useTable({
  getListApi: getFunPayListApi,
  delListApi: deleteFunPayApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList()

const getHeadInfo = async () => {
  const info = await getFunPaySumAmount()
  headInfo.value = info
}

const getLpListHandle = async () => {
  const res: any = await getLpList()
  if (res && res.length) {
    lpList.value = res
  }
}
const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
onMounted(() => {
  getHeadInfo()
  getLpListHandle()
  getdistrictTree()
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
    field: 'receivePaymentUnit',
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
    field: 'type',
    label: '财产户',
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
    field: 'type',
    label: '户号',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'funSubjectId',
    label: '所属区域',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'amount',
    label: '金额(元)',
    search: {
      show: false
    }
  },
  {
    field: 'applyType',
    label: '待发金额(元)',
    search: {
      show: false
    }
  },

  {
    field: 'paymentTime',
    label: '可发金额(元)',
    search: {
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

let { allSchemas } = useCrudSchemas(schema)

const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData)

  if (searchData.relation == '1') {
    searchData.relation = ['is', 1]
  } else if (searchData.relation == '0') {
    searchData.relation = ['not', 1]
  } else {
    delete searchData.relation
  }

  // 处理参数
  let params = {
    ...searchData
  }
  tableObject.params = {
    projectId
  }
  if (params.code) {
    delete params.code
    setSearchParams({ ...params })
  } else {
    delete params.code
    setSearchParams({ ...params })
  }
}

const onEditFormClose = (flag: boolean) => {
  if (flag) {
    getHeadInfo()
    getList()
  }
  dialog.value = false
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
