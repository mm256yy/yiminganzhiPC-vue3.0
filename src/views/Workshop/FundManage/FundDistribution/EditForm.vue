<template>
  <WorkContentWrap>
    <div class="table-wrap">
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
        <template #grantTime="{ row }">
          <div>{{ row.grantTime ? dayjs(row.grantTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div>
        </template>
        <template #grantStatus="{ row }">
          <div>{{ row.grantStatus == '1' ? '已放款' : '未放款' }}</div>
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
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import EditForm from './EditForm.vue'
import {
  getFunAmountGrant,
  deleteFunPayApi,
  getLpListApi,
  getFunPaySumAmountApi
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
const { register, tableObject, methods } = useTable({
  getListApi: getFunAmountGrant,
  delListApi: deleteFunPayApi
})
const { getList } = methods

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
onMounted(() => {
  getHeadInfo()
  getLpListHandle()
  getdistrictTree()
})

const schema = reactive<CrudSchema[]>([
  // table
  {
    width: 80,
    field: 'type',
    label: '类型'
  },
  {
    width: 160,
    field: 'name',
    label: '指标名称',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'doorNo',
    label: '金额（元）',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'villageText',
    label: '是否发放',
    search: {
      show: false
    }
  },
  {
    width: 160,
    field: 'type',
    label: '发放日期',
    search: {
      show: false
    }
  },

  {
    field: 'grantTime',
    label: '发放人',
    search: {
      show: false
    }
  }
])

let { allSchemas } = useCrudSchemas(schema)

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
