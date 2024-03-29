<template>
  <WorkContentWrap>
    <div style="padding: 14px 16px">
      <div style="display: flex; justify-content: space-between">
        <div>生产安置信息</div>
        <div>
          <ElButton type="primary" @click="comdbe"> 打印 </ElButton>

          <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
          <ElButton type="primary" @click="handleadd">增加</ElButton>
        </div>
      </div>
      <div>
        本户共计征收土地：{{ (headerData?.area / 666.66).toFixed(2) }}亩，参保系数为：{{
          dictObj[420][0].value
        }}，可参保{{ (headerData?.area / 666.66 / dictObj[420][0].value).toFixed(0) }}人
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
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="closeDocumentation" />

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
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="font-size: 24px; font-weight: bold; text-align: center">生产安置</h1>
      <div
        style="
          display: flex;
          margin: 20px 0 20px 0;
          font-size: 18px;
          justify-content: space-between;
        "
      >
        <div>
          {{
            `${baseInfo.areaCodeText} ${baseInfo.townCodeText} ${baseInfo.villageText} ${baseInfo.name} 户号 ${baseInfo.showDoorNo} `
          }}</div
        >

        <div>{{ data }}</div>
      </div>
      <el-table
        :data="tableObject.tableList"
        style="width: 100%"
        border
        header-cell-class-name="table-headers"
        cell-class-name="table-cellss"
      >
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="relationText" label="与户主关系" align="center" />
        <el-table-column prop="card" label="身份证号" align="center" />
        <el-table-column prop="phone" label="联系方式" align="center" />
        <el-table-column prop="settingWayText" label="安置类型" align="center" />
      </el-table>
      <div style="display: flex; justify-content: space-between; height: 50px">
        <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1"
          >户主代表或收委托人(签名)：</div
        ><div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
          联系移民干部(签名)：</div
        >
      </div>
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ElButton, ElDialog, ElMessage, ElTable, ElTableColumn } from 'element-plus'
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
import OnDocumentation from '@/views/Workshop/ImmigrantImplement/DataFill/ResettleConfirm/Produce/OnDocumentation.vue' // 引入档案上传组件
import { debounce } from '@/utils/index'
import { htmlToPdf } from '@/utils/ptf'
import dayjs from 'dayjs'

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
let dialog = ref(false)
let data = ref()
const onDocumentation = () => {
  dialog.value = true
}
const closeDocumentation = () => {
  dialog.value = false
}
let comdbe = () => {
  data.value = dayjs(new Date()).format('YYYY年MM月DD日')
  console.log(tableObject.tableList)

  debounce(() => {
    // ElMessage.error('待业主提供模板')
    htmlToPdf('#anztable', '生产安置')
  })
}
onMounted(async () => {
  headerData.value = await getLandAreaByDoorNoApi(props.doorNo)
  getList()
  console.log(tableObject.tableList, 'bbq')
})
</script>
<style lang="less" scoped>
#anztable {
  :deep(.table-headers) {
    font-size: 12px;
    font-weight: bold;
    background: none;
  }

  .el-table {
    --el-table-border-color: black;
    --el-table-border: 1px solid black;
  }

  :deep(.table-cellss) {
    .cell {
      font-size: 10px;
      background: none;
    }
  }
}
</style>
