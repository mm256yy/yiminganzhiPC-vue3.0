<template>
  <WorkContentWrap>
    <div style="padding: 14px 16px">
      <div style="display: flex; justify-content: space-between">
        <div>生产安置信息</div>
        <ElButton type="primary" @click="handleadd">增加</ElButton>
      </div>
      <div>
        本户共计征收土地：{{ headerData?.area }}亩，参保系数为：{{
          dictObj[420][0].value
        }}，可参保{{ headerData?.cbNum }}人
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        :pagination="{
          total: tableObject.total
        }"
        highlightCurrentRow
        @register="register"
      >
        <template #action="{ row }">
          <TableEditColumn
            :row="row"
            :view-type="'link'"
            @delete="onDelRow"
            @edit="onEditRow(row)"
          />
        </template>
      </Table>
    </div>
    <Edit
      :show="dialogVisible"
      :row="rows"
      :title="title"
      @close="
        () => {
          dialogVisible = false
          getList()
        }
      "
      @save="handleEdit"
    />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import {
  getProduceListApi,
  AddProduceListApi,
  deleteProduceListApi,
  updateProduceListApi,
  getLandAreaByDoorNoApi
} from '@/api/immigrantImplement/resettleConfirm/produce-service'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { reactive, ref, onMounted, computed } from 'vue'
import Edit from './Edit.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useAppStore } from '@/store/modules/app'
const { register, tableObject, methods } = useTable({
  getListApi: getProduceListApi,
  delListApi: deleteProduceListApi
})
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'relationText',
    label: '与户主关系',
    search: {
      show: false
    }
  },
  {
    field: 'phone',
    label: '联系方式',
    search: {
      show: false
    }
  },
  {
    width: 180,
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'settingWayText',
    label: '安置方式',
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    search: {
      show: false
    }
  }
])
interface PropsType {
  doorNo: string
  baseInfo: any
}
const props = defineProps<PropsType>()
const { allSchemas } = useCrudSchemas(schema)
const { getList } = methods
tableObject.params = {
  doorNo: props.doorNo,
  projectId: props.baseInfo.projectId,
  status: props.baseInfo.status
}
getList()
let dialogVisible = ref(false)
let rows = ref({})
let title = ref('')
let handleadd = () => {
  if (tableObject.tableList.length > headerData.value?.cbNum) {
    ElMessage.error('已超过可参保人数')
    return
  }
  title.value = '添加生产安置人口'
  dialogVisible.value = true
  rows.value = {}
}
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let handleEdit = (e, m?) => {
  if (!m) {
    AddProduceListApi({
      ...e,
      doorNo: props.baseInfo.doorNo,
      householdId: props.baseInfo.id,
      projectId,
      status: props.baseInfo.status
    }).then((res) => {
      console.log(res)

      if (res) {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        getList()
      }
    })
  } else {
    updateProduceListApi({ ...e }).then((res) => {
      if (res) {
        ElMessage.success('修改成功')
        dialogVisible.value = false
        getList()
      }
    })
    console.log(e)
  }
}
const onDelRow = async (row: any, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}
const onEditRow = (row) => {
  title.value = '编辑生产安置人口'
  rows.value = row
  dialogVisible.value = true
}
let headerData = ref()
onMounted(async () => {
  headerData.value = await getLandAreaByDoorNoApi(props.doorNo)
})
</script>
